import { Home as HomeIcon, Sparkles, TrendingUp, Info } from "lucide-react";
import { formatCurrency, calculateProgress } from "@/utils/calculations";

interface MethodCardsProps {
  needsActual: number;
  needsTarget: number;
  wantsActual: number;
  wantsTarget: number;
  savingsActual: number;
  savingsTarget: number;
  onInfoClick: () => void;
}

export default function MethodCards({
  needsActual,
  needsTarget,
  wantsActual,
  wantsTarget,
  savingsActual,
  savingsTarget,
  onInfoClick
}: MethodCardsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Método 50/30/20
        </h3>
        <button
          onClick={onInfoClick}
          className="p-2.5 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
          title="O que é isso?"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Essenciais - 50% */}
        <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <HomeIcon className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400 border border-white/10">50%</span>
          </div>

          <div className="space-y-1 mb-4">
            <h4 className="text-zinc-400 text-sm font-medium">Essenciais</h4>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(needsActual)}
            </div>
            <p className="text-xs text-zinc-500">
              Meta: {formatCurrency(needsTarget)}
            </p>
          </div>

          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/50"
              style={{ width: `${calculateProgress(needsActual, needsTarget)}%` }}
            ></div>
          </div>
        </div>

        {/* Desejos - 30% */}
        <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400 border border-white/10">30%</span>
          </div>

          <div className="space-y-1 mb-4">
            <h4 className="text-zinc-400 text-sm font-medium">Desejos</h4>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(wantsActual)}
            </div>
            <p className="text-xs text-zinc-500">
              Meta: {formatCurrency(wantsTarget)}
            </p>
          </div>

          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-500/50"
              style={{ width: `${calculateProgress(wantsActual, wantsTarget)}%` }}
            ></div>
          </div>
        </div>

        {/* Investimentos - 20% */}
        <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400 border border-white/10">20%</span>
          </div>

          <div className="space-y-1 mb-4">
            <h4 className="text-zinc-400 text-sm font-medium">Investimentos</h4>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(savingsActual)}
            </div>
            <p className="text-xs text-zinc-500">
              Meta: {formatCurrency(savingsTarget)}
            </p>
          </div>

          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/50"
              style={{ width: `${calculateProgress(savingsActual, savingsTarget)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
