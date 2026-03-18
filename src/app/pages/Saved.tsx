import React from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, BookOpen, Trash2 } from "lucide-react";
import { useIngredients } from "../services/IngredientContext";
import { NeuralAnalyticsDashboard } from "../components/analytics/NeuralAnalyticsDashboard";
import { RecipeCard } from "../components/recipes/RecipeCard";

export function Saved() {
    const nav = useNavigate();
    const { wasteHistory, scannedItems, savedRecipes, unsaveRecipe } = useIngredients();

    return (
        <div className="pb-28 pt-6 relative">
            <button onClick={() => nav(-1)} className="fixed top-[1rem] left-[1rem] z-[110] w-[2.5rem] h-[2.5rem] bg-[#0d231b]/80 backdrop-blur-xl border border-white/5 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} className="text-white" />
            </button>
            <div className="px-6 mb-8 mt-2 text-left">
                <NeuralAnalyticsDashboard data={wasteHistory} scannedItems={scannedItems} />
            </div>

            {savedRecipes.length === 0 ? (
                <div className="px-4 flex flex-col items-center justify-center py-10 text-center bg-white/5 rounded-[2rem] border border-white/5 mx-4">
                    <div className="w-[4rem] h-[4rem] bg-primary/5 rounded-full border border-primary/10 flex items-center justify-center mb-4">
                        <BookOpen style={{ width: '1.75rem', height: '1.75rem' }} className="text-primary/40" />
                    </div>
                    <h2 className="text-[0.63rem] font-black text-white/50 uppercase mb-4 tracking-widest">暫無儲存的食譜方案</h2>
                    <button onClick={() => nav("/")} className="bg-primary text-black px-8 py-4 rounded-[1rem] font-black uppercase text-[0.65rem] tracking-widest shadow-[0_10px_30px_var(--primary-glow)] hover:scale-105 transition-all">啟動掃描器去發掘</button>
                </div>
            ) : (
                <div className="px-4 space-y-3">
                    <h3 className="text-[9px] font-black text-white/30 uppercase tracking-widest px-1">我的收藏食譜 ({savedRecipes.length})</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {savedRecipes.map((recipe) => (
                            <div key={recipe.id} className="relative group">
                                <RecipeCard recipe={recipe} onClick={() => nav(`/recipe/${recipe.id}`)} getCategoryLabel={(c) => c === "vegetable" ? "蔬菜" : c === "fruit" ? "水果" : c === "meat" ? "肉類" : "綜合"} />
                                <button onClick={(e) => { e.stopPropagation(); unsaveRecipe(recipe.id); }} className="absolute top-[1rem] right-[1rem] z-30 w-[2.2rem] h-[2.2rem] rounded-full bg-red-500/20 text-red-500 border border-red-500/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 style={{ width: '1.1rem', height: '1.1rem' }} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
