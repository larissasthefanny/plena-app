"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import TransactionModal from "@/components/TransactionModal";
import MethodInfoModal from "@/components/MethodInfoModal";
import GoalModal from "@/components/GoalModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCards from "@/components/dashboard/StatCards";
import MethodCards from "@/components/dashboard/MethodCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import GoalsSection from "@/components/dashboard/GoalsSection";
import TransactionsList from "@/components/dashboard/TransactionsList";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { calculateFinancials, getChartData } from "@/utils/calculations";

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const {
    transactions,
    loading,
    fetchTransactions,
    deleteTransaction,
    resetTransactions
  } = useTransactions(currentDate);

  const {
    goals,
    fetchGoals,
    deleteGoal,
    addProgress
  } = useGoals();

  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, [fetchTransactions, fetchGoals]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleOpenModal = (transaction: Transaction | null = null) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
    fetchTransactions();
  };

  const handleOpenGoalModal = (goal: Goal | null = null) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const handleGoalModalClose = () => {
    setIsGoalModalOpen(false);
    setGoalToEdit(null);
    fetchGoals();
  };

  const handleLogout = () => {
    localStorage.removeItem("plena_token");
    router.push("/login");
  };

  const financials = calculateFinancials(transactions);
  const chartData = getChartData(
    financials.needsActual,
    financials.wantsActual,
    financials.savingsActual
  );

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
          <DashboardHeader
            currentDate={currentDate}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onReset={resetTransactions}
            onLogout={handleLogout}
            onNewTransaction={() => handleOpenModal()}
          />

          <StatCards
            totalIncome={financials.totalIncome}
            available={financials.available}
          />

          <MethodCards
            needsActual={financials.needsActual}
            needsTarget={financials.needsTarget}
            wantsActual={financials.wantsActual}
            wantsTarget={financials.wantsTarget}
            savingsActual={financials.savingsActual}
            savingsTarget={financials.savingsTarget}
            onInfoClick={() => setIsInfoModalOpen(true)}
          />

          <ExpenseChart
            chartData={chartData}
            totalExpenses={financials.totalExpenses}
          />

          <GoalsSection
            goals={goals}
            onNewGoal={() => handleOpenGoalModal()}
            onEditGoal={handleOpenGoalModal}
            onDeleteGoal={deleteGoal}
            onAddProgress={addProgress}
          />

          <TransactionsList
            transactions={transactions}
            loading={loading}
            onEdit={handleOpenModal}
            onDelete={deleteTransaction}
          />
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
