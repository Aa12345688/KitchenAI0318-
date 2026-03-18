import { Clock, TrendingUp, ChevronRight, Leaf } from "lucide-react";

interface RecipeCardProps {
    recipe: any;
    onClick: () => void;
    getCategoryLabel: (cat: string) => string;
}

/**
 * 食譜卡片組件 (RecipeCard)
 * 負責渲染在「AI 食譜推薦列表」中的單一食譜預覽圖文框。
 */
export function RecipeCard({ recipe, onClick, getCategoryLabel }: RecipeCardProps) {
    const handleCardClick = () => {
        // ✨ 精英級手機震動回饋 (Haptic Feedback)
        if ('vibrate' in navigator) {
            navigator.vibrate(10); // 10ms 極短震動，模擬機械手感
        }
        onClick();
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative rounded-2xl overflow-hidden bg-[#0d231b]/60 backdrop-blur-xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)] border border-white/5 transition-all duration-500 cursor-pointer hover:translate-y-[-2px] p-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both performance-layer"
        >
            {/* Square Image Container */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg bg-white/5">
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    loading="lazy"
                    onLoad={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.classList.add("scale-100");
                        e.currentTarget.classList.remove("scale-105");
                    }}
                    style={{ opacity: 0 }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40" />
                
                {/* Match Score Badge (Inside Image) */}
                <div className="absolute top-1.5 right-1.5 bg-[#0d231b]/90 backdrop-blur-md rounded-md p-1 border border-primary/30 flex flex-col items-center min-w-[32px] shadow-xl">
                    <span className="text-[9px] font-black text-primary">{recipe.matchScore}%</span>
                    <span className="text-[4px] font-black text-white/40 uppercase tracking-tighter">MATCH</span>
                </div>

                {/* Sustainability Badge */}
                {recipe.sustainabilityTip && (
                    <div className="absolute top-1.5 left-1.5 bg-primary rounded-md px-1.5 py-1 flex items-center gap-1 shadow-lg border border-white/20">
                        <Leaf size={10} className="text-[#0f2e24]" fill="currentColor" />
                        <span className="text-[8px] font-black text-[#0f2e24] uppercase tracking-tighter">ECO</span>
                    </div>
                )}
            </div>

            <div className="w-full px-1">
                <div className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center justify-between mb-0.5">
                        <div className="bg-primary text-[#0f2e24] text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                            AI RECO
                        </div>
                        <div className="text-white/30 text-[5px] font-black uppercase">
                            {getCategoryLabel(recipe.category)}
                        </div>
                    </div>
                    
                    <h3 className="font-black text-[10px] text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2 min-h-[24px]">{recipe.name}</h3>
                </div>

                <div className="flex items-center justify-between mb-2 text-[6px] font-black text-white/30 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Clock size={8} className="text-primary/60" />
                            <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp size={8} className="text-primary/60" />
                            <span>{recipe.difficulty}</span>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full bg-primary text-[#0f2e24] py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                    <span>COOK</span>
                    <ChevronRight size={10} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
