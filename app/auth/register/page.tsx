"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, MapPin, ArrowRight, AlertCircle } from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, city, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      router.push("/compte");
      router.refresh();
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-clay-900 border border-harvest-400/40 flex items-center justify-center shadow-lg">
            <span className="font-serif font-bold text-harvest-400 text-xl">T</span>
          </div>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-clay-900">
          Créer un Compte Client
        </h2>
        <p className="text-xs sm:text-sm text-sand-600">
          Suivez vos commandes et téléchargez vos factures en toute simplicité.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-warm-lg rounded-3xl border border-sand-300 space-y-5">
          {/* Google Sign Up Button */}
          <div className="space-y-4">
            <GoogleAuthButton text="S'inscrire avec Google" />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-sand-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-sand-500 font-medium uppercase tracking-wider shrink-0">
                ou remplir le formulaire
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
              <label className="block text-xs font-semibold text-clay-800 mb-1">
                Nom complet ou Raison Sociale *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Coopérative Agro des Plateaux"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Adresse Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-clay-800 mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Ville / Région
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Douala, Bafoussam..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Adresse de livraison
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, Rue..."
                  className="w-full px-4 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-bold text-xs shadow-warm-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Création du compte..." : "Finaliser mon inscription"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-sand-600">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="font-bold text-terracotta-600 hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
