"use client";

import { useState, useEffect } from "react";
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
  Info
} from "lucide-react";
import MethodInfoModal from "@/components/MethodInfoModal";

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("plena_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleReset = async () => {
    if (!confirm("Tem certeza que deseja apagar todas as transações? Isso não pode ser desfeito.")) {
      return;
    }

    const token = localStorage.getItem("plena_token");
    if (!token) return;

    try {
      setLoading(true);
      await fetch("http://localhost:8080/api/reset", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setTransactions([]);
    } catch (error) {
      console.error("Failed to reset data", error);
      alert("Erro ao resetar dados");
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

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-6 sm:p-8 font-sans selection:bg-purple-500/30">
      <TransactionModal isOpen={isModalOpen} onClose={handleModalClose} transactionToEdit={transactionToEdit} />
      <MethodInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />

      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-900/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Plena
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">FINANÇAS PESSOAIS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              title="Resetar Dados"
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              title="Sair"
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-zinc-800 mx-1"></div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nova</span>
            </button>
          </div>
        </header>

        {/* Main Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <Wallet className="w-5 h-5" />
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

          <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 shadow-2xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 p-32 bg-green-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <PiggyBank className="w-5 h-5" />
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
            <div className="p-6 rounded-3xl bg-[#111] border border-zinc-800 hover:border-blue-500/30 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs font-bold text-zinc-400 border border-zinc-800">50%</span>
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

              <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProgress(needsActual, needsTarget)}%` }}
                ></div>
              </div>
            </div>

            {/* Wants - 30% */}
            <div className="p-6 rounded-3xl bg-[#111] border border-zinc-800 hover:border-purple-500/30 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs font-bold text-zinc-400 border border-zinc-800">30%</span>
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

              <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProgress(wantsActual, wantsTarget)}%` }}
                ></div>
              </div>
            </div>

            {/* Savings - 20% */}
            <div className="p-6 rounded-3xl bg-[#111] border border-zinc-800 hover:border-emerald-500/30 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs font-bold text-zinc-400 border border-zinc-800">20%</span>
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

              <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProgress(savingsActual, savingsTarget)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-zinc-200">Últimas Transações</h3>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">Ver todas</button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#111] border border-zinc-800/50 hover:bg-zinc-900 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-full ${item.type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20'
                    : 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20'
                    } transition-colors`}>
                    {item.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-200">{item.category}</h4>
                    {item.description && (
                      <p className="text-xs text-zinc-500">{item.description}</p>
                    )}
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${item.type === 'income' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                  {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                </span>
              </div>
            ))}

            {!loading && transactions.length === 0 && (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                <div className="inline-flex items-center justify-center p-4 bg-zinc-800 rounded-full mb-4 text-zinc-500">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-zinc-400 font-medium">Nenhuma transação ainda</p>
                <p className="text-zinc-600 text-sm mt-1">Clique em "Nova" para começar</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
