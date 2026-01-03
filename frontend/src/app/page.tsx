"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TransactionModal from "@/components/TransactionModal";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  LogOut,
  RotateCcw,
  Plus,
  Home as HomeIcon,
  Sparkles,
  TrendingUp,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Info,
  Target
} from "lucide-react";
import MethodInfoModal from "@/components/MethodInfoModal";
import GoalModal from "@/components/GoalModal";
import GoalCard from "@/components/GoalCard";

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
  user_id: number;
}

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any | null>(null);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("plena_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    try {
      const res = await fetch(`${getApiUrl()}/api/transactions?month=${month}&year=${year}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("plena_token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [currentDate, router]);

  const fetchGoals = useCallback(async () => {
    const token = localStorage.getItem("plena_token");
    if (!token) return;

    try {
      const res = await fetch(`${getApiUrl()}/api/goals`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setGoals(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch goals", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchGoals();
  }, [fetchData, fetchGoals]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatCurrentMonth = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const handleOpenModal = (transaction: Transaction | null = null) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    const token = localStorage.getItem("plena_token");
    try {
      const res = await fetch(`${getApiUrl()}/api/transactions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Transação excluída!");
        fetchData();
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  }

  const handleOpenGoalModal = (goal: Goal | null = null) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  }

  const handleGoalModalClose = () => {
    setIsGoalModalOpen(false);
    setGoalToEdit(null);
    fetchGoals();
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return;

    const token = localStorage.getItem("plena_token");
    try {
      const res = await fetch(`${getApiUrl()}/api/goals/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Meta excluída!");
        fetchGoals();
      } else {
        toast.error("Erro ao excluir meta.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  }

  const handleAddProgress = async (id: number, amount: number) => {
    const token = localStorage.getItem("plena_token");
    try {
      const res = await fetch(`${getApiUrl()}/api/goals/${id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (res.ok) {
        toast.success("Progresso adicionado!");
        fetchGoals();
      } else {
        toast.error("Erro ao adicionar progresso.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  }

  const handleReset = async () => {
    if (!confirm("Tem certeza que deseja apagar todas as transações? Isso não pode ser desfeito.")) {
      return;
    }

    const token = localStorage.getItem("plena_token");
    if (!token) return;

    try {
      setLoading(true);
      await fetch(`${getApiUrl()}/api/reset`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setTransactions([]);
      toast.success("Dados resetados!");
    } catch (error) {
      console.error("Failed to reset data", error);
      toast.error("Erro ao resetar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("plena_token");
    router.push("/login");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const available = totalIncome - totalExpenses;

  const needsTarget = totalIncome * 0.5;
  const wantsTarget = totalIncome * 0.3;
  const savingsTarget = totalIncome * 0.2;

  const needsActual = transactions
    .filter((t) => t.type === "expense" && t.category === "Essenciais")
    .reduce((acc, t) => acc + t.amount, 0);

  const wantsActual = transactions
    .filter((t) => t.type === "expense" && t.category === "Desejos")
    .reduce((acc, t) => acc + t.amount, 0);

  const savingsActual = transactions
    .filter((t) => t.type === "expense" && t.category === "Investimentos")
    .reduce((acc, t) => acc + t.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculateProgress = (actual: number, target: number) => {
    if (target === 0) return 0;
    const percentage = (actual / target) * 100;
    return Math.min(percentage, 100);
  };

  const chartData = [
    { name: 'Essenciais', value: needsActual, color: '#3b82f6' },
    { name: 'Desejos', value: wantsActual, color: '#a855f7' },
    { name: 'Investimentos', value: savingsActual, color: '#10b981' }
  ].filter(d => d.value > 0);

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-8 font-sans selection:bg-purple-500/30 relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/[0.03] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/[0.03] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <TransactionModal isOpen={isModalOpen} onClose={handleModalClose} transactionToEdit={transactionToEdit} />
        <MethodInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
        <GoalModal isOpen={isGoalModalOpen} onClose={handleGoalModalClose} goalToEdit={goalToEdit} />

        <div className="max-w-6xl mx-auto space-y-8">

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
                  <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  title="Resetar Dados"
                  className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  title="Sair"
                  className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova</span>
                </button>
              </div>
            </div>
          </header>

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

        {/* 50/30/20 Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Método 50/30/20
            </h3>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="p-2.5 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors"
              title="O que é isso?"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Needs - 50% */}
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

            {/* Wants - 30% */}
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

            {/* Savings - 20% */}
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

        {/* Chart Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-zinc-200">Distribuição de Gastos</h3>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/5 flex items-center justify-center relative min-h-[320px] hover:bg-white/[0.04] transition-all">
            {chartData.length > 0 ? (
              <div className="w-full h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        backdropFilter: 'blur(20px)',
                        color: '#fff',
                        padding: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                    <p className="text-xs font-medium text-zinc-400 uppercase mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-3 text-zinc-500">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <p className="text-zinc-400 font-medium">Sem dados de gastos</p>
                <p className="text-zinc-600 text-sm mt-1">Adicione despesas para ver o gráfico</p>
              </div>
            )}
          </div>
        </section>

        {/* Goals Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Minhas Metas
            </h3>
            <button
              onClick={() => handleOpenGoalModal()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold transition-all border border-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Meta</span>
            </button>
          </div>

          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenGoalModal}
                  onDelete={handleDeleteGoal}
                  onAddProgress={handleAddProgress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-xl">
              <div className="inline-flex items-center justify-center p-4 bg-white/[0.02] rounded-full mb-4 text-zinc-600">
                <Target className="w-6 h-6" />
              </div>
              <p className="text-zinc-300 font-medium">Nenhuma meta ainda</p>
              <p className="text-zinc-500 text-sm mt-1">Crie sua primeira meta financeira</p>
            </div>
          )}
        </section>

        {/* Transactions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-zinc-200">Últimas Transações</h3>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
                    } transition-colors`}>
                    {item.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100">{item.category}</h4>
                    {item.description && (
                      <p className="text-sm text-zinc-400">{item.description}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-1">
                      {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`font-bold text-lg ${item.type === 'income' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                  </span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && transactions.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-xl">
                <div className="inline-flex items-center justify-center p-4 bg-white/[0.02] rounded-full mb-4 text-zinc-600">
                  <Wallet className="w-8 h-8" />
                </div>
                <p className="text-zinc-300 font-semibold text-lg">Nenhuma transação ainda</p>
                <p className="text-zinc-500 text-sm mt-2">Clique em &quot;Nova&quot; para começar a gerenciar suas finanças</p>
              </div>
            )}
          </div>
        </section>
      </div>
      </div>

      {/* Botão flutuante para mobile */}
      <button
        onClick={() => handleOpenModal()}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50"
        title="Nova Transação"
      >
        <Plus className="w-7 h-7" />
      </button>
    </main>
  );
}
