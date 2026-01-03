import { Target, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Goal {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
}

interface GoalCardProps {
    goal: Goal;
    onEdit: (goal: Goal) => void;
    onDelete: (id: number) => void;
    onAddProgress: (id: number, amount: number) => void;
}

export default function GoalCard({ goal, onEdit, onDelete, onAddProgress }: GoalCardProps) {
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const isCompleted = progress >= 100;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleAddProgress = () => {
        const amountStr = prompt("Quanto você quer adicionar a esta meta?");
        if (amountStr && !isNaN(parseFloat(amountStr))) {
            onAddProgress(goal.id, parseFloat(amountStr));
        }
    };

    return (
        <div className="p-6 rounded-3xl bg-[#111] border border-zinc-800 hover:border-purple-500/30 transition-all group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'} transition-colors`}>
                        <Target className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-white truncate">{goal.name}</h4>
                        <p className="text-xs text-zinc-500 break-words">Prazo: {formatDate(goal.deadline)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={handleAddProgress}
                        className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-colors"
                        title="Adicionar progresso"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(goal.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                        title="Excluir meta"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Progresso</span>
                    <span className="font-semibold text-white">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-zinc-800/50 h-3 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-600'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-zinc-500">Atual</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(goal.current_amount)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-500">Meta</p>
                    <p className="text-lg font-bold text-purple-400">{formatCurrency(goal.target_amount)}</p>
                </div>
            </div>

            {isCompleted && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                    <span className="text-sm font-semibold text-emerald-400">🎉 Meta Alcançada!</span>
                </div>
            )}
        </div>
    );
}
