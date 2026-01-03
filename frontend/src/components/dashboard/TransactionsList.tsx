import { ArrowUpCircle, ArrowDownCircle, Wallet, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

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

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionsList({ transactions, loading, onEdit, onDelete }: TransactionsListProps) {
  return (
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
                <button onClick={() => onEdit(item)} className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(item.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
  );
}
