import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Plus, ChefHat, Snowflake, Package, Sparkles, Loader2, Trash2, Edit2, Minus, Clock, X, AlertTriangle } from "lucide-react";
import { useIngredients } from "../services/IngredientContext";
import { InventoryStats } from "../components/inventory_management/InventoryStats";
import { AddEntryForm } from "../components/inventory_management/AddEntryForm";
import { EditItemModal } from "../components/inventory_management/EditItemModal";

export function Inventory() {
    const navigate = useNavigate();
    const { scannedItems, addItem, updateQuantity, removeIngredient, selectedIds, toggleSelection, generateRecipe, updateItem, updateSettings, settings } = useIngredients();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [storageTab, setStorageTab] = useState<"fridge" | "freezer">("fridge");
    const [categoryTab, setCategoryTab] = useState("全部");
    const [categoryPage, setCategoryPage] = useState(0); 
    const [editingItem, setEditingItem] = useState<any>(null);

    const categories = ["全部", "蔬菜", "水果", "肉類", "海鮮", "乳製品", "五穀", "其他"];

    const filtered = scannedItems.filter(i => {
        const matchesStorage = (i.storageType || "fridge") === storageTab;
        const matchesCategory = categoryTab === "全部" || i.category === categoryTab;
        return matchesStorage && matchesCategory;
    });

    const expiredCount = scannedItems.filter(i => {
        const daysPassed = Math.floor((Date.now() - (i.timestamp || Date.now())) / (1000 * 60 * 60 * 24));
        const expiryDays = i.expiryDays !== undefined ? i.expiryDays : 7;
        const daysLeft = expiryDays - daysPassed;
        return daysLeft <= 0 || i.isSpoiled;
    }).length;

    const handleSaveEdit = (id: string, updates: any) => {
        updateItem(id, { ...updates, timestamp: Date.now() });
        setEditingItem(null);
    };

    const containerRef = useRef(null);
    const { scrollY } = useScroll({ target: containerRef });
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div ref={containerRef} className="pb-28 pt-6 relative overflow-hidden">
            <button onClick={() => navigate(-1)} className="fixed top-[1rem] left-[1rem] z-[110] w-[2.5rem] h-[2.5rem] bg-[#0d231b]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} className="text-white" />
            </button>
            <div className="flex justify-end px-[1rem] mb-[0.5rem]">
                <button onClick={() => {
                    setShowForm(!showForm);
                    updateSettings({ isModalOpen: !showForm });
                }} className="p-[0.5rem] bg-primary rounded-[0.75rem] shadow-lg hover:scale-105 active:scale-95 transition-all">
                    <Plus style={{ width: '1.25rem', height: '1.25rem' }} className="text-black stroke-[3]" />
                </button>
            </div>

            <div className="sticky top-2 z-20 pb-2 px-4 py-2 space-y-3">
                <div className="flex bg-[#0d231b]/90 backdrop-blur-md p-[0.25rem] rounded-full border border-white/5 shadow-xl">
                    <button onClick={() => setStorageTab('fridge')} className={`flex-1 py-[0.7rem] rounded-full text-[0.7rem] font-black uppercase transition-all flex items-center justify-center gap-2 ${storageTab === 'fridge' ? 'bg-primary text-black shadow-[0_0_15px_var(--primary-glow)]' : 'text-gray-500 hover:text-white'}`}>
                        <ChefHat style={{ width: '1.2rem', height: '1.2rem' }} /> 冷藏庫
                    </button>
                    <button onClick={() => setStorageTab('freezer')} className={`flex-1 py-[0.7rem] rounded-full text-[0.7rem] font-black uppercase transition-all flex items-center justify-center gap-2 ${storageTab === 'freezer' ? 'bg-blue-400 text-black shadow-[0_0_15px_rgba(96,165,250,0.3)]' : 'text-gray-500 hover:text-white'}`}>
                        <Snowflake style={{ width: '1.2rem', height: '1.2rem' }} /> 冷凍庫
                    </button>
                </div>

                {/* Paginated Category Tabs */}
                <div className="relative overflow-hidden group px-1">
                    <motion.div 
                        className="flex w-[200%] cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: -100, right: 0 }} // Simplified for robustness
                        dragElastic={0.2}
                        onDragEnd={(e, info) => {
                            if (info.offset.x < -50 && categoryPage === 0) setCategoryPage(1);
                            if (info.offset.x > 50 && categoryPage === 1) setCategoryPage(0);
                        }}
                        animate={{ x: categoryPage === 0 ? "0%" : "-50%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Page 1 */}
                        <div className="w-1/2 flex gap-2 pr-2">
                            {categories.slice(0, 4).map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCategoryTab(c)}
                                    className={`flex-1 px-1 py-[0.6rem] rounded-[1.2rem] text-[0.6rem] font-black uppercase tracking-tighter border transition-all pointer-events-auto ${
                                        categoryTab === c 
                                        ? (storageTab === 'fridge' ? 'bg-primary border-primary text-black shadow-[0_0_20px_var(--primary-glow)] scale-105' : 'bg-blue-400 border-blue-400 text-black shadow-[0_0_20px_rgba(96,165,250,0.4)] scale-105') 
                                        : 'bg-black/30 border-white/5 text-gray-500 hover:border-white/20'
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        {/* Page 2 */}
                        <div className="w-1/2 flex gap-2 pl-2">
                            {categories.slice(4, 8).map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCategoryTab(c)}
                                    className={`flex-1 px-1 py-[0.6rem] rounded-[1.2rem] text-[0.6rem] font-black uppercase tracking-tighter border transition-all pointer-events-auto ${
                                        categoryTab === c 
                                        ? (storageTab === 'fridge' ? 'bg-primary border-primary text-black shadow-[0_0_20px_var(--primary-glow)] scale-105' : 'bg-blue-400 border-blue-400 text-black shadow-[0_0_20px_rgba(96,165,250,0.4)] scale-105') 
                                        : 'bg-black/30 border-white/5 text-gray-500 hover:border-white/20'
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Pagination Indicators */}
                    <div className="flex justify-center gap-1.5 mt-3">
                        {[0, 1].map(p => (
                            <button 
                                key={p} 
                                onClick={() => setCategoryPage(p)}
                                className={`h-1 rounded-full transition-all duration-300 ${categoryPage === p ? (storageTab === 'fridge' ? 'w-6 bg-primary' : 'w-6 bg-blue-400') : 'w-2 bg-white/10'}`} 
                            />
                        ))}
                    </div>
                </div>

            </div>

            <div className="px-4 mb-1.5 cursor-pointer">
                <button
                    onClick={async () => {
                        setIsGenerating(true);
                        try {
                            await generateRecipe();
                            navigate("/recipes");
                        } catch (e: any) {
                            alert(e.message);
                        } finally {
                            setIsGenerating(false);
                        }
                    }}
                    disabled={isGenerating || selectedIds.length === 0}
                    className={`w-full ${storageTab === 'fridge' ? 'bg-primary shadow-[0_15px_50px_var(--primary-glow)]' : 'bg-blue-400 shadow-[0_15px_50px_rgba(96,165,250,0.3)]'} text-black py-4 rounded-full font-black text-[0.75rem] uppercase tracking-widest disabled:opacity-50 transition-all hover:scale-[1.02] hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center gap-2.5`}
                >
                    {isGenerating ? <Loader2 style={{ width: '1.2rem', height: '1.2rem' }} className="animate-spin relative z-10" /> : <Sparkles style={{ width: '1.2rem', height: '1.2rem' }} className="relative z-10" />}
                    <span className="relative z-10">{isGenerating ? "正在為您量子合成食譜..." : "生成 AI 食譜方案"}</span>
                </button>
            </div>

            <InventoryStats freshItems={scannedItems.length - expiredCount} expiredItems={expiredCount} />

            {showForm && (<AddEntryForm onAdd={(item) => addItem(item, "manual")} onDismiss={() => {
                setShowForm(false);
                updateSettings({ isModalOpen: false });
            }} categories={["全部", "蔬菜", "水果", "肉類", "海鮮", "乳製品", "五穀", "其他"]} />)}

            <div className="px-4 py-3">
                <h3 className="font-black text-[0.63rem] uppercase text-white/30 mb-3 px-1">存貨紀錄 ({filtered.length})</h3>
                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/5">
                        <Package size={48} className="mx-auto mb-4 text-white/10" />
                        <p className="text-[0.63rem] font-bold text-gray-500">該庫存區域為空</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(i => {
                            const daysPassed = Math.floor((Date.now() - (i.timestamp || Date.now())) / (1000 * 60 * 60 * 24));
                            const expiryDays = i.expiryDays !== undefined ? i.expiryDays : 7;
                            const daysLeft = expiryDays - daysPassed;
                            const isExpired = daysLeft <= 0;
                            const isWarning = !isExpired && daysLeft <= 2;

                            return (
                                <motion.div key={i.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`bg-[#0d231b]/80 backdrop-blur-md rounded-2xl p-3 border transition-all relative overflow-hidden group shadow-md ${i.isSpoiled || isExpired ? 'border-red-500/50 bg-red-500/5' : isWarning ? 'border-amber-400/50 bg-amber-400/5' : 'border-white/10'}`}>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => toggleSelection(i.id)} disabled={i.isSpoiled || isExpired} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${i.isSpoiled || isExpired ? 'opacity-20 cursor-not-allowed border-gray-600' : selectedIds.includes(i.id) ? (storageTab === 'fridge' ? 'bg-primary border-primary' : 'bg-blue-400 border-blue-400') : 'bg-transparent border-white/20'}`}>
                                            {selectedIds.includes(i.id) && !i.isSpoiled && !isExpired && <div className="w-3 h-3 bg-background rounded-sm" />}
                                            {(i.isSpoiled || isExpired) && <X size={12} className="text-red-500" />}
                                        </button>
                                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 relative">
                                            <Package size={18} className={i.isSpoiled || isExpired ? "text-red-500" : storageTab === 'fridge' ? "text-primary" : "text-blue-400"} />
                                            {(i.isSpoiled || isExpired) && <div className="absolute inset-0 bg-red-500/10 rounded-xl" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-black text-sm truncate uppercase ${i.isSpoiled || isExpired ? 'text-red-500/70 line-through' : 'text-white'}`}>{i.name}</h4>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className={`text-[0.55rem] font-black uppercase px-2 py-0.5 rounded-md ${i.isSpoiled ? 'bg-red-500/10 text-red-500' : storageTab === 'fridge' ? 'bg-primary/10 text-primary' : 'bg-blue-400/10 text-blue-400'}`}>{i.isSpoiled ? "品質異常" : (i.category || "其他")}</span>
                                                <span className={`text-[0.55rem] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${isExpired || i.isSpoiled ? 'bg-red-500 text-white' : isWarning ? 'bg-amber-400 text-zinc-950' : 'bg-white/5 text-gray-400'}`}><Clock style={{ width: '0.5rem', height: '0.5rem' }} />{isExpired ? "已過期" : i.isSpoiled ? "偵測毀損" : isWarning ? `即將到期 (${daysLeft}天)` : `保鮮 ${daysLeft} 天`}</span>
                                                {i.timestamp && (
                                                    <span className="text-[0.5rem] font-black text-white/30 uppercase px-2 py-0.5 rounded-md border border-white/5 bg-white/5">
                                                        登錄 {new Date(i.timestamp).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })} {new Date(i.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => {
                                                setEditingItem(i);
                                                updateSettings({ isModalOpen: true });
                                            }} className="w-8 h-8 rounded-full bg-white/5 text-gray-400 flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"><Edit2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-1.5 mt-1.5">
                                        <div className="flex items-center bg-background/80 rounded-full p-0.5 border border-white/10">
                                            <button onClick={() => updateQuantity(i.id, -1)} className={`w-6 h-6 flex items-center justify-center text-gray-400 hover:${storageTab === 'fridge' ? 'text-primary' : 'text-blue-400'}`}><Minus size={10} strokeWidth={3} /></button>
                                            <span className="w-6 text-center font-black text-white text-[10px]">{i.quantity}</span>
                                            <button onClick={() => updateQuantity(i.id, 1)} className={`w-6 h-6 flex items-center justify-center text-gray-400 hover:${storageTab === 'fridge' ? 'text-primary' : 'text-blue-400'}`}><Plus size={10} strokeWidth={3} /></button>
                                        </div>
                                        <button onClick={() => removeIngredient(i.id)} className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"><Trash2 size={10} strokeWidth={3} /></button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {editingItem && (
                <EditItemModal item={editingItem} onSave={handleSaveEdit} onDismiss={() => {
                    setEditingItem(null);
                    updateSettings({ isModalOpen: false });
                }} />
            )}
        </div>
    );
}
