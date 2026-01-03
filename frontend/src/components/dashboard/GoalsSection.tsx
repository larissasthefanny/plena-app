import { Target, Plus } from "lucide-react";
import GoalCard from "@/components/GoalCard";

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

interface GoalsSectionProps {
  goals: Goal[];
  onNewGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: number) => void;
  onAddProgress: (id: number, amount: number) => void;
}

export default function GoalsSection({ goals, onNewGoal, onEditGoal, onDeleteGoal, onAddProgress }: GoalsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Minhas Metas
        </h3>
        <button
          onClick={onNewGoal}
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
              onEdit={onEditGoal}
              onDelete={onDeleteGoal}
              onAddProgress={onAddProgress}
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
  );
}
