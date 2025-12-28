"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
            const res = await fetch("http://localhost:8080/api/register", {
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
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <div className="w-full max-w-md space-y-8 px-4 sm:px-6">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Plena
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Crie sua conta e comece a economizar
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-700 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-700 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">
                                Confirmar Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-700 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-400 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                            >
                                {loading ? "Criando conta..." : "Criar Conta"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Já tem uma conta? <Link href="/login" className="text-purple-400 hover:text-purple-300">Entre aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
