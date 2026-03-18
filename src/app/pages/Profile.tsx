import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles, ChefHat, Palette, Settings, Bell, HelpCircle, ChevronRight, LogOut, ChevronLeft } from "lucide-react";
import { useIngredients } from "../services/IngredientContext";
import { llmService } from "../services/llmService";
import { SettingsModal } from "../components/profile/SettingsModal";

export function Profile() {
    const { settings, updateSettings, clearAll, clearInventory, clearWasteHistory, resetSettings } = useIngredients();
    const nav = useNavigate();
    const [apiStatus, setApiStatus] = useState<{ status: 'online' | 'offline' | 'no_key', model: string, keyCount: number } | null>(null);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            const status = await llmService.testConnection();
            setApiStatus(status);
        };
        check();
    }, []);

    const settingsGrid = [
        { id: 'api', label: "神經節點", desc: "API & Model", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
        { id: 'dietary', label: "飲食偏好", desc: "Preferences", icon: ChefHat, color: "text-primary", bg: "bg-primary/10" },
        { id: 'theme', label: "視覺風格", desc: "Premium Theme", icon: Palette, color: "text-rose-400", bg: "bg-rose-500/10" },
        { id: 'display', label: "介面縮放", desc: "UI Scaling", icon: Settings, color: "text-blue-400", bg: "bg-blue-500/10" },
        { id: 'system', label: "系統設定", desc: "System", icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10" },
        { id: 'data', label: "數據管理", desc: "Data Core", icon: LogOut, color: "text-red-400", bg: "bg-red-500/10" },
    ];

    return (
        <div className="pb-28 px-6 pt-6 relative min-h-screen">
            <button onClick={() => nav(-1)} className="fixed top-[1rem] left-[1rem] z-[110] w-[2.5rem] h-[2.5rem] bg-[#0d231b]/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-lg text-white">
                <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            <h2 className="text-center text-[0.5rem] font-black text-white/10 uppercase tracking-[0.4em] mb-6">Neural Core Interface</h2>
            
            <div className="flex flex-col items-center mb-8">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 rounded-[2rem] bg-[#1a4d3d] border-4 border-primary/20 flex items-center justify-center shadow-[0_20px_50px_rgba(0,255,136,0.15)] mb-4 relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-[2rem] animate-pulse group-hover:bg-primary/10 transition-all" />
                    <User size={40} className="text-primary relative z-10" strokeWidth={1} />
                </motion.div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1.5">管理中心</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /><span className="text-[0.63rem] font-black text-primary uppercase tracking-widest">已認證：首席美食品味家</span></div>
            </div>

            <div 
                className="grid gap-3 mb-8"
                style={{ 
                    // 核心排列邏輯：按鈕縮小時，一行可以塞更多；按鈕放大時，自動換行
                    gridTemplateColumns: `repeat(auto-fit, minmax(calc(120px * var(--zoom-factor, 1)), 1fr))` 
                }}
            >
                {settingsGrid.map((item) => (
                    <motion.button 
                        key={item.id} 
                        whileHover={{ scale: 1.02, y: -2 }} 
                        whileTap={{ scale: 0.98 }} 
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                            setActiveModal(item.id);
                            updateSettings({ isModalOpen: true });
                        }} 
                        className="p-4 rounded-[2rem] bg-[#0d231b]/60 backdrop-blur-xl border border-white/5 flex flex-col items-center text-center shadow-xl group transition-all relative z-10 gap-3"
                    >
                        <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-all shrink-0`}>
                            <item.icon style={{ width: '1.4rem', height: '1.4rem' }} className={item.color} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[0.63rem] font-black text-white uppercase tracking-wider truncate">{item.label}</div>
                            <div className="text-[0.44rem] font-bold text-gray-500 uppercase tracking-widest mt-0.5 truncate">{item.desc}</div>
                        </div>
                    </motion.button>
                ))}
            </div>

            <button onClick={() => nav("/saved")} className="w-full flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all mb-4 group">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20"><HelpCircle size={24} className="text-amber-400" /></div><div><div className="text-xs font-black text-white uppercase tracking-wider">耗損數據分析</div><div className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Neural Consumption Dashboard</div></div></div>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-all" />
            </button>

            <AnimatePresence>{activeModal && (<SettingsModal type={activeModal} onClose={() => {
                setActiveModal(null);
                updateSettings({ isModalOpen: false });
            }} settings={settings} updateSettings={updateSettings} apiStatus={apiStatus} onClearInventory={clearInventory} onClearWaste={clearWasteHistory} onResetSettings={resetSettings} onClearAll={clearAll} />)}</AnimatePresence>
            <div className="text-center mt-12 opacity-20"><div className="text-[0.5rem] font-black text-white uppercase tracking-[0.5em]">KITCHEN AI v1.6.0 / ELITE CORE</div></div>
        </div>
    );
}
