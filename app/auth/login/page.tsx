"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Identifiants invalides");
        setLoading(false);
        return;
      }

      router.push(data.redirectUrl || "/compte");
      router.refresh();
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const handleFillDemo = (type: "admin" | "client") => {
    if (type === "admin") {
      setEmail("admin@terranova.agri");
      setPassword("AdminTerra2026!");
    } else {
      setEmail("client@terranova.agri");
      setPassword("ClientTerra2026!");
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sand-200/50 via-sand-50 to-sand-50 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-clay-900 border border-harvest-400/40 flex items-center justify-center shadow-lg">
            <span className="font-serif font-bold text-harvest-400 text-xl">T</span>
          </div>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-clay-900">
          Espace Sécurisé TERRANOVA
        </h2>
        <p className="text-xs sm:text-sm text-sand-600">
          Connectez-vous pour suivre vos commandes ou accéder au back-office.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-warm-lg rounded-3xl border border-sand-300 space-y-6">
          {/* Google Sign In Button */}
          <div className="space-y-4">
            <GoogleAuthButton text="Se connecter avec Google" />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-sand-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-sand-500 font-medium uppercase tracking-wider shrink-0">
                ou avec votre email
              </span>
              <div className="border-t border-sand-200 w-full" />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-clay-800 mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-clay-800">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 font-bold text-xs shadow-warm-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="pt-4 border-t border-sand-200 text-center">
            <span className="text-[11px] font-semibold text-sand-500 uppercase tracking-wider block mb-2.5">
              Comptes de Démonstration Pré-remplis
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="p-2.5 rounded-xl bg-sand-100 hover:bg-harvest-100/60 border border-sand-200 text-xs text-clay-900 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-harvest-600" />
                <span>Rôle Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("client")}
                className="p-2.5 rounded-xl bg-sand-100 hover:bg-terracotta-100/60 border border-sand-200 text-xs text-clay-900 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Rôle Client</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="text-center text-xs text-sand-600">
            Nouveau client ?{" "}
            <Link href="/auth/register" className="font-bold text-terracotta-600 hover:underline">
              Créer un compte en 1 minute
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
