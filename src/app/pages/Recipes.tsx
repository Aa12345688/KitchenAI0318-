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
                    const res = await llmService.generateRecipes({ 
                        ingredients: scannedItems.map(i => i.name),
                        // ✨ 樂觀式更新：一旦本地規則過濾完畢，立即顯示食譜，不必等候 AI 審核
                        onOptimisticResult: (optimisticRecipes) => {
                            setRecipes(optimisticRecipes);
                            setIsLoading(false); // 提早結束 loading 狀態
                        }
                    });
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
                    <div className="space-y-6">
                        {/* 步驟提示浮層 */}
                        <div className="flex flex-col gap-2.5 items-center justify-center py-6 bg-white/5 rounded-[2rem] border border-white/10">
                            <h3 className="text-primary font-black text-[10px] uppercase animate-pulse mb-1 tracking-widest">AI 食譜引擎運算中</h3>
                            <div className="flex flex-col gap-1.5 items-start">
                                <LoadingStep icon="🤖" label="AI 生成食譜建議" delay="0s" />
                                <LoadingStep icon="📋" label="規則層：過濾危險組合" delay="1s" />
                                <LoadingStep icon="✅" label="食安審核：確認可安全食用" delay="2s" />
                            </div>
                        </div>

                        {/* 骨架屏網格 */}
                        <div className="grid grid-cols-2 gap-3 opacity-40">
                            {[...Array(4)].map((_, i) => (
                                <RecipeSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                ) : recommendedRecipes.length > 0 ? (
                    <div className="space-y-4 optimize-list">
                        {/* 審核說明橫幅 */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                            <span className="text-base">✅</span>
                            <p className="text-primary text-[8px] font-black uppercase tracking-wide">
                                以下食譜已通過 AI 雙層食安審核，確認符合一般人可食標準
                            </p>
                        </div>
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

/** 載入中的骨架屏元件 */
function RecipeSkeleton() {
    return (
        <div className="rounded-2xl bg-white/5 border border-white/5 p-2 flex flex-col gap-2 h-full">
            <div className="relative w-full aspect-square rounded-xl bg-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="space-y-2 px-1 pb-2">
                <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                <div className="h-3 w-full bg-white/10 rounded-full" />
                <div className="h-6 w-full bg-white/5 rounded-lg mt-2" />
            </div>
        </div>
    );
}

/** 帶動畫延遲的 loading 步驟提示元件 */
function LoadingStep({ icon, label, delay }: { icon: string; label: string; delay: string }) {
    return (
        <div
            className="flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: delay }}
        >
            <span className="text-[10px]">{icon}</span>
            <span className="text-white/50 text-[7px] font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}
