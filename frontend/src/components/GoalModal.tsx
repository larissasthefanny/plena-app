import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Goal {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
}

interface GoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalToEdit?: Goal | null;
}

export default function GoalModal({ isOpen, onClose, goalToEdit }: GoalModalProps) {
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (goalToEdit) {
            setName(goalToEdit.name);
            setTargetAmount(goalToEdit.target_amount.toString());
            setDeadline(goalToEdit.deadline.split('T')[0]);
        } else {
            setName("");
            setTargetAmount("");
            setDeadline("");
        }
    }, [goalToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem("plena_token");
        const isEditing = !!goalToEdit;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;
        const endpoint = isEditing
            ? `${apiUrl}/api/goals/${goalToEdit.id}`
            : `${apiUrl}/api/goals`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    target_amount: parseFloat(targetAmount),
                    deadline: new Date(deadline).toISOString()
                })
            });

            if (res.ok) {
                toast.success(isEditing ? "Meta atualizada!" : "Meta criada!");
                onClose();
            } else {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                toast.error(`Erro: ${errorText || "Não foi possível salvar a meta"}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Erro de conexão com o servidor");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-semibold text-white mb-6">
                    {goalToEdit ? "Editar Meta" : "Nova Meta"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Nome da Meta
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Viagem para Europa"
                            required
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Valor Alvo (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Prazo
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Salvando..." : goalToEdit ? "Atualizar" : "Criar Meta"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
