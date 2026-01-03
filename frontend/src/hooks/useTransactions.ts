import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export function useTransactions(currentDate: Date) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
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

  const deleteTransaction = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    const token = localStorage.getItem("plena_token");
    try {
      const res = await fetch(`${getApiUrl()}/api/transactions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Transação excluída!");
        fetchTransactions();
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  };

  const resetTransactions = async () => {
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

  return {
    transactions,
    loading,
    fetchTransactions,
    deleteTransaction,
    resetTransactions
  };
}
