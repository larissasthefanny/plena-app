"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, UserPlus, Sparkles, TrendingUp, PiggyBank, Shield } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;
            const res = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Erro ao criar conta.");
            }

            const data = await res.json();
            localStorage.setItem("plena_token", data.token);
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro desconhecido");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Background decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Lado Esquerdo - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="max-w-lg space-y-8 relative z-10">
                    <div>
                        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                            Plena
                        </h1>
                        <p className="text-2xl font-semibold text-zinc-200 mb-4">
                            Comece sua jornada financeira hoje
                        </p>
                        <p className="text-zinc-400 text-lg">
                            Junte-se a milhares de pessoas que já estão no controle das suas finanças
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-100 mb-1">Método 50/30/20</h3>
                                <p className="text-sm text-zinc-400">Organize suas finanças de forma inteligente e eficaz</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-100 mb-1">Metas Financeiras</h3>
                                <p className="text-sm text-zinc-400">Defina e alcance seus objetivos com facilidade</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <PiggyBank className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-100 mb-1">Controle Total</h3>
                                <p className="text-sm text-zinc-400">Visualize seus gastos e receitas em tempo real</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all">
                            <div className="p-3 bg-pink-500/10 rounded-xl">
                                <Shield className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-100 mb-1">100% Seguro</h3>
                                <p className="text-sm text-zinc-400">Seus dados protegidos com criptografia avançada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                            Plena
                        </h1>
                        <p className="text-zinc-400 mt-2">Inteligência Financeira</p>
                    </div>

                    {/* Card do formulário */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4">
                                <UserPlus className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-100 mb-2">Criar Conta</h2>
                            <p className="text-zinc-400 text-sm">Preencha seus dados para começar</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white placeholder-zinc-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/[0.05] transition-all sm:text-sm outline-none"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white placeholder-zinc-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/[0.05] transition-all sm:text-sm outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl text-white placeholder-zinc-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/[0.05] transition-all sm:text-sm outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? "Criando conta..." : "Criar Conta"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-zinc-400">
                                Já tem uma conta?{" "}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                    Entre aqui
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
