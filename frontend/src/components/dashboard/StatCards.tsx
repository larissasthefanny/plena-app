import { Wallet, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface StatCardsProps {
  totalIncome: number;
  available: number;
}

export default function StatCards({ totalIncome, available }: StatCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group hover:bg-white/[0.04] transition-all">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-zinc-400 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Renda Mensal</span>
          </div>
          <div className="text-5xl font-bold text-white tracking-tight mb-2">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-sm text-zinc-500">
            Total acumulado este mês
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col justify-center relative overflow-hidden hover:bg-white/[0.04] transition-all">
        <div className="absolute bottom-0 left-0 p-32 bg-green-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-zinc-400 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <PiggyBank className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Disponível</span>
          </div>
          <div className={`text-4xl font-bold tracking-tight mb-2 ${available >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(available)}
          </div>
          <p className="text-sm text-zinc-500">
            Renda menos despesas totais
          </p>
        </div>
      </div>
    </section>
  );
}
