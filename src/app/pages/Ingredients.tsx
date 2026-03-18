import React from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Trash2, Plus } from "lucide-react";
import { useIngredients } from "../services/IngredientContext";
import { DetectionRow } from "../components/inventory_management/DetectionRow";

export function Ingredients() {
    const navigate = useNavigate();
    const { scannedItems, updateQuantity, removeItem, clearAll } = useIngredients();
    
    return (
        <div className="pb-32 pt-6 relative">
            {/* Minimal Floating Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-[1rem] left-[1rem] z-[110] w-[2.5rem] h-[2.5rem] bg-[#0d231b]/80 backdrop-blur-xl border border-white/5 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
                <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} className="text-white" />
            </button>

            <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        掃描紀錄
                    </h2>
                    <button 
                        onClick={clearAll} 
                        className="p-[0.5rem] bg-red-500/10 hover:bg-red-500 hover:text-white rounded-[0.75rem] border border-red-500/20 text-red-500 transition-all"
                    >
                        <Trash2 style={{ width: '1.1rem', height: '1.1rem' }} />
                    </button>
                </div>

                {scannedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                        <div className="relative mb-[2rem] group">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[2.5rem]" />
                            <div className="relative w-[6rem] h-[6rem] bg-[#1a4d3d]/50 rounded-[2rem] border border-primary/20 flex items-center justify-center shadow-2xl">
                                <Plus style={{ width: '2.5rem', height: '2.5rem' }} className="text-primary/30" />
                            </div>
                        </div>
                        <h3 className="text-[0.85rem] font-black text-white/30 uppercase tracking-widest mb-6 px-4">目前無數據暫存</h3>
                        <button 
                            onClick={() => navigate("/")} 
                            className="flex items-center gap-3 bg-primary text-black px-10 py-4 rounded-[1rem] font-black uppercase text-[0.65rem] shadow-[0_10px_40px_var(--primary-glow)] hover:scale-105 active:scale-95 transition-all"
                        >
                            啟動感測器
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {scannedItems.slice(0, 10).map((item) => (
                            <DetectionRow 
                                key={item.id} 
                                item={item} 
                                onUpdate={updateQuantity} 
                                onRemove={removeItem} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
