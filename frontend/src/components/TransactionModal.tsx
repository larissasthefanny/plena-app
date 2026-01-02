import { useState, useEffect } from "react";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Transaction {
    id: number;
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date: string;
}

export default function TransactionModal({
    isOpen,
    onClose,
    transactionToEdit
}: {
    isOpen: boolean;
    onClose: () => void;
    transactionToEdit?: Transaction | null;
}) {
    const [type, setType] = useState<"income" | "expense">("income");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Salário");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (transactionToEdit) {
            setType(transactionToEdit.type);
            setAmount(transactionToEdit.amount.toString());
            setCategory(transactionToEdit.category);
            setDescription(transactionToEdit.description);
            const d = new Date(transactionToEdit.date);
            setDate(d);
        } else {
            setType("income");
            setAmount("");
            setCategory("Salário");
            setDescription("");
            setDate(new Date());
        }
    }, [transactionToEdit, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const isEditing = !!transactionToEdit;
        const endpoint = isEditing
            ? `/api/transactions/${transactionToEdit.id}`
            : (type === "income" ? "/api/income" : "/api/expense");

        const method = isEditing ? "PUT" : "POST";

        try {
            const token = localStorage.getItem("plena_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;
            const res = await fetch(`${apiUrl}${endpoint}`, {
                method: method,
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    category,
                    description,
                    date: date.toISOString(),
                    type // Needed for PUT, ignored for POST endpoints usually unless universal
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (res.ok) {
                toast.success(isEditing ? "Transação atualizada!" : "Transação adicionada!");
                onClose();
                setAmount("");
                setDescription("");
            } else {
                toast.error("Erro ao salvar transação.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {transactionToEdit ? "Editar Transação" : "Nova Transação"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg">
                        <button
                            type="button"
                            onClick={() => { setType("income"); if (!transactionToEdit) setCategory("Salário"); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "income" ? "bg-green-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}
                        >
                            Receita
                        </button>
                        <button
                            type="button"
                            onClick={() => { setType("expense"); if (!transactionToEdit) setCategory("Essenciais"); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "expense" ? "bg-red-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}
                        >
                            Despesa
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Valor
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-zinc-500">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 pl-10 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="0,00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Data
                        </label>
                        <DatePicker
                            selected={date}
                            onChange={(date: Date | null) => date && setDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Descrição
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            placeholder="Ex: Compra no mercado"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Categoria
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                        >
                            {type === "income" ? (
                                <>
                                    <option value="Salário">Salário</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Investimentos">Rendimento</option>
                                    <option value="Outros">Outros</option>
                                </>
                            ) : (
                                <>
                                    <option value="Essenciais">🏠 Essenciais (50%)</option>
                                    <option value="Desejos">🎉 Desejos (30%)</option>
                                    <option value="Investimentos">💰 Investimentos (20%)</option>
                                    <option value="Outros">Outros</option>
                                </>
                            )}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-4 text-white font-medium py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${type === "income" ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500" : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500"}`}
                    >
                        {isLoading ? "Salvando..." : (!!transactionToEdit ? "Atualizar" : (type === "income" ? "Adicionar Receita" : "Adicionar Despesa"))}
                    </button>
                </form>
            </div>
        </div>
    );
}
