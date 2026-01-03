import { LogOut, RotateCcw, Plus, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onReset: () => void;
  onLogout: () => void;
  onNewTransaction: () => void;
}

export default function DashboardHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onReset,
  onLogout,
  onNewTransaction
}: DashboardHeaderProps) {
  const formatCurrentMonth = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-900/50">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Plena
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">DASHBOARD</p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 pl-4 pr-1 shadow-lg">
          <span className="text-sm font-medium text-zinc-300 capitalize">{formatCurrentMonth(currentDate)}</span>
          <div className="flex gap-1">
            <button onClick={onPrevMonth} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={onNextMonth} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Resetar Dados"
            className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={onLogout}
            title="Sair"
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>
          <button
            onClick={onNewTransaction}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova</span>
          </button>
        </div>
      </div>
    </header>
  );
}
