"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;
            const res = await fetch(`${apiUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Credenciais inválidas");
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
        <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
            {/* Background decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Container principal */}
            <div className="relative z-10 flex w-full">
                {/* Lado esquerdo - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                    <div className="max-w-md space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">Método 50/30/20 Automático</span>
                        </div>
                        
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            Transforme sua
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                relação com o dinheiro
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-300">
                            Gerencie suas finanças de forma inteligente e alcance seus objetivos financeiros.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-purple-400">📊</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Dashboard Inteligente</h3>
                                    <p className="text-sm text-gray-400">Visualize seus gastos em tempo real</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-purple-400">🎯</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Metas Financeiras</h3>
                                    <p className="text-sm text-gray-400">Crie e acompanhe suas conquistas</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-purple-400">🔒</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">100% Seguro</h3>
                                    <p className="text-sm text-gray-400">Seus dados protegidos com criptografia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado direito - Formulário */}
                <div className="flex items-center justify-center w-full lg:w-1/2 p-6 sm:p-12">
                    <div className="w-full max-w-md">
                        {/* Card do formulário */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">
                            {/* Header */}
                            <div className="text-center space-y-2">
                                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                    Plena
                                </h2>
                                <p className="text-gray-400">
                                    Bem-vindo de volta! 👋
                                </p>
                            </div>

                            {/* Formulário */}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10 transition-all duration-200 sm:text-sm"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Senha */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Senha
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10 transition-all duration-200 sm:text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Botão de submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Entrando...
                                            </>
                                        ) : (
                                            <>
                                                Entrar
                                                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <p className="text-center text-sm text-gray-400">
                                    Não tem uma conta?{" "}
                                    <Link 
                                        href="/register" 
                                        className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                    >
                                        Cadastre-se gratuitamente
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Texto adicional mobile */}
                        <div className="lg:hidden mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                ✨ Junte-se a milhares de usuários gerenciando suas finanças com o Plena
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
