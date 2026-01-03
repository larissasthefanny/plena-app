import { useState, useCallback } from "react";
import { toast } from "sonner";

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

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

  const deleteGoal = async (id: number) => {
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
  };

  const addProgress = async (id: number, amount: number) => {
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
  };

  return {
    goals,
    fetchGoals,
    deleteGoal,
    addProgress
  };
}
