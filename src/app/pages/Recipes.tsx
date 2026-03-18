import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Sparkles, ChefHat } from "lucide-react";
import { useIngredients } from "../services/IngredientContext";
import { llmService } from "../services/llmService";
import { getRecommendedRecipes } from "../data/recipes";
import { RecipeCard } from "../components/recipes/RecipeCard";
import { IngredientCloud } from "../components/recipes/IngredientCloud";

export function Recipes() {
    const navigate = useNavigate();
    const { scannedItems, recommendedRecipes, setRecipes } = useIngredients();
    const [hasAttempted, setHasAttempted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (scannedItems.length > 0 && recommendedRecipes.length === 0 && !hasAttempted) {
            const fetchRecipes = async () => {
                setIsLoading(true);
                setHasAttempted(true);
                try {
                    const res = await llmService.generateRecipes({ ingredients: scannedItems.map(i => i.name) });
                    setRecipes(res);
                } catch (error) {
                    setRecipes(getRecommendedRecipes(scannedItems)); 
                } finally { 
                    setIsLoading(false); 
                }
            };
            fetchRecipes();
        } else if (recommendedRecipes.length > 0 || scannedItems.length === 0 || hasAttempted) {
            setIsLoading(false);
        }
    }, [scannedItems, recommendedRecipes, setRecipes, hasAttempted]);

    return (
        <div className="pb-28 pt-6 relative">
            {/* Minimal Floating Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-4 left-4 z-[110] w-10 h-10 bg-[#0d231b]/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
                <ChevronLeft size={20} className="text-white" />
            </button>

            <div className="px-6 py-4">
                <IngredientCloud items={scannedItems} onAddMore={() => navigate("/inventory")} />
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white/5 rounded-[2.5rem] border border-white/10">
                        <div className="relative w-14 h-14">
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse" size={18} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-primary font-black text-[10px] uppercase animate-pulse mb-1">運算中...</h3>
                            <p className="text-gray-500 text-[8px] font-bold uppercase">正在分析口味分佈</p>
                        </div>
                    </div>
                ) : recommendedRecipes.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {recommendedRecipes.map((r) => (
                                <RecipeCard 
                                    key={r.id} 
                                    recipe={r} 
                                    onClick={() => navigate(`/recipe/${r.id}`)} 
                                    getCategoryLabel={(c) => c === "vegetable" ? "蔬菜" : c === "fruit" ? "水果" : c === "meat" ? "肉類" : "綜合"} 
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary/5 rounded-full flex items-center justify-center">
                            <ChefHat size={32} className="text-primary/20" />
                        </div>
                        <h4 className="text-white font-black text-xs uppercase mb-2">未發現相容方案</h4>
                        <button 
                            onClick={() => navigate("/")} 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-2xl font-black uppercase text-[9px]"
                        >
                            返回掃描
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
