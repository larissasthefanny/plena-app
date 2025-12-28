import { X } from "lucide-react";

interface MethodInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MethodInfoModal({ isOpen, onClose }: MethodInfoModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    O Método 50/30/20
                </h2>

                <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                    <p>
                        Uma regra simples para organizar seu orçamento mensal e garantir equilíbrio financeiro.
                    </p>

                    <div className="space-y-2">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <span className="font-bold text-blue-400 block mb-1">50% - Essenciais</span>
                            <span className="text-xs text-zinc-400">Gastos fixos e indispensáveis: Aluguel, contas (luz, água), supermercado, transporte e educação.</span>
                        </div>

                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <span className="font-bold text-purple-400 block mb-1">30% - Desejos</span>
                            <span className="text-xs text-zinc-400">Estilo de vida e lazer: Jantar fora, hobbies, streaming, compras pessoais e viagens.</span>
                        </div>

                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <span className="font-bold text-emerald-400 block mb-1">20% - Investimentos</span>
                            <span className="text-xs text-zinc-400">Futuro e segurança: Reserva de emergência, aposentadoria, quitar dívidas e investimentos.</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
}
