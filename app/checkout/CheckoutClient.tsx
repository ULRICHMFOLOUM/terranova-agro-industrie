"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  User,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppOrderLink } from "@/lib/fapshi";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

interface CheckoutClientProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
  } | null;
}

export function CheckoutClient({ currentUser }: CheckoutClientProps) {
  const router = useRouter();
  const { items, subtotalAmount, clearCart } = useCart();

  // Authentication inline modal state
  const [user, setUser] = useState(currentUser);
  const [showAuthModal, setShowAuthModal] = useState(!currentUser);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Checkout form state
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [shippingCity, setShippingCity] = useState("Douala");
  const [shippingAddress, setShippingAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"FAPSHI_MOMO" | "FAPSHI_OM" | "WHATSAPP">("FAPSHI_MOMO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle inline auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        authMode === "login"
          ? { email: authEmail, password: authPassword }
          : { name: authName, email: authEmail, password: authPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Erreur d'authentification");
        setAuthLoading(false);
        return;
      }

      setUser(data.user);
      setCustomerName(data.user.name);
      setCustomerEmail(data.user.email);
      if (data.user.phone) setCustomerPhone(data.user.phone);
      setShowAuthModal(false);
      setAuthLoading(false);
    } catch {
      setAuthError("Erreur réseau. Veuillez réessayer.");
      setAuthLoading(false);
    }
  };

  const handleFillDemoClient = () => {
    setAuthEmail("client@terranova.agri");
    setAuthPassword("ClientTerra2026!");
  };

  // Handle Order Submit
  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setSubmitError("Veuillez renseigner vos coordonnées complètes (Nom, Email, Téléphone).");
      return;
    }

    if (paymentMethod === "WHATSAPP") {
      // Direct WhatsApp Order
      const link = generateWhatsAppOrderLink({
        phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237690000000",
        customerName,
        items: items.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          unit: it.unit,
          price: it.price,
        })),
        total: subtotalAmount,
      });
      window.open(link, "_blank");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingCity,
          shippingAddress,
          customerNotes,
          paymentMethod,
          items: items.map((it) => ({
            id: it.id,
            name: it.name,
            quantity: it.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Erreur lors de la validation.");
        setIsSubmitting(false);
        return;
      }

      // Nettoyer le panier local
      clearCart();

      if (data.paymentLink) {
        router.push(data.paymentLink);
      } else if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
      }
    } catch {
      setSubmitError("Erreur réseau lors de la validation de commande.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-sand-300 shadow-warm-sm max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center text-sand-500 mx-auto">
          <ShoppingBag className="w-8 h-8 opacity-50" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-clay-900">
          Votre panier est actuellement vide
        </h2>
        <p className="text-xs text-sand-600 leading-relaxed">
          Ajoutez des produits de nos filières agricoles et d&apos;élevage pour finaliser votre commande.
        </p>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-clay-900 text-sand-50 font-semibold text-xs hover:bg-clay-800 transition-colors shadow-sm"
        >
          <span>Découvrir le catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-clay-900">
          Finalisation de Votre Commande
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Parcours d&apos;achat sécurisé avec paiement Fapshi (Orange Money & MTN MoMo) et facture instantanée.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Details & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Auth status banner if logged in */}
          {user ? (
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-between text-xs text-sage-900">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>
                  Connecté en tant que <strong>{user.name}</strong> ({user.email})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="text-[11px] font-semibold text-terracotta-700 hover:underline"
              >
                Changer de compte
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Connexion requise pour finaliser la commande et générer votre facture.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-lg bg-clay-900 text-sand-50 text-xs font-bold"
              >
                Connexion / Inscription
              </button>
            </div>
          )}

          {submitError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleFinalOrderSubmit} className="space-y-6">
            {/* Step 1: Coordonnées & Livraison */}
            <div className="p-6 rounded-3xl bg-white border border-sand-300 shadow-warm-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-sand-100 pb-3">
                <div className="w-6 h-6 rounded-full bg-clay-900 text-harvest-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <h3 className="font-serif text-base font-bold text-clay-900">
                  Coordonnées & Destination de Livraison
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-clay-800 mb-1">
                    Nom du client / Raison Sociale *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Coopérative Agricole"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-clay-800 mb-1">
                    Email de facturation *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="facture@domaine.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-clay-800 mb-1">
                    Numéro de Téléphone (MoMo / OM) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-clay-800 mb-1">
                    Ville / Région *
                  </label>
                  <select
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-medium"
                  >
                    <option value="Douala">Douala (Littoral)</option>
                    <option value="Yaoundé">Yaoundé (Centre)</option>
                    <option value="Bafoussam">Bafoussam (Ouest / Noun)</option>
                    <option value="Garoua">Garoua (Nord)</option>
                    <option value="Autre">Autre région / Retrait en ferme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Adresse exacte de livraison
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Quartier, rue, repère logistique..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Instructions ou remarques spéciales
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Ex: Horaires de déchargement préférés, conditionnement spécifique..."
                  className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>

            {/* Step 2: Mode de Paiement */}
            <div className="p-6 rounded-3xl bg-white border border-sand-300 shadow-warm-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-sand-100 pb-3">
                <div className="w-6 h-6 rounded-full bg-clay-900 text-harvest-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </div>
                <h3 className="font-serif text-base font-bold text-clay-900">
                  Mode de Paiement & Facturation
                </h3>
              </div>

              <div className="space-y-3">
                {/* Option 1: Fapshi MoMo */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "FAPSHI_MOMO"
                      ? "border-terracotta-600 bg-terracotta-50/50 shadow-sm"
                      : "border-sand-200 hover:border-sand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "FAPSHI_MOMO"}
                    onChange={() => setPaymentMethod("FAPSHI_MOMO")}
                    className="mt-1 text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-terracotta-600" />
                      <span className="font-bold text-xs text-clay-900">
                        MTN Mobile Money / Orange Money (Paiement Fapshi Direct)
                      </span>
                    </div>
                    <p className="text-[11px] text-sand-600 mt-1 leading-relaxed">
                      Paiement instantané et sécurisé avec notification USSD sur votre téléphone. Facture PDF émise automatiquement.
                    </p>
                  </div>
                </label>

                {/* Option 2: WhatsApp Direct */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "WHATSAPP"
                      ? "border-[#25D366] bg-[#25D366]/10 shadow-sm"
                      : "border-sand-200 hover:border-sand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "WHATSAPP"}
                    onChange={() => setPaymentMethod("WHATSAPP")}
                    className="mt-1 text-[#25D366] focus:ring-[#25D366]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-[#25D366]" />
                      <span className="font-bold text-xs text-clay-900">
                        Finaliser la Commande sur WhatsApp
                      </span>
                    </div>
                    <p className="text-[11px] text-sand-600 mt-1 leading-relaxed">
                      Transmettez votre panier directement à un conseiller commercial TERRANOVA pour convenir des modalités de règlement.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Validation CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 hover:from-terracotta-600 hover:to-terracotta-800 text-white font-bold text-sm shadow-warm-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              id="checkout-submit-btn"
            >
              <span>
                {isSubmitting
                  ? "Validation en cours..."
                  : `Payer et Valider (${formatPrice(subtotalAmount)})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-sand-300 shadow-warm-md space-y-5">
            <h3 className="font-serif text-lg font-bold text-clay-900 border-b border-sand-100 pb-3">
              Récapitulatif des Articles ({items.length})
            </h3>

            <div className="divide-y divide-sand-100 max-h-80 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                    <Image src={it.image} alt={it.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-clay-900 truncate">{it.name}</h4>
                    <p className="text-[11px] text-sand-500 font-mono">
                      {it.quantity} {it.unit} × {formatPrice(it.price)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-xs text-clay-900 shrink-0">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-sand-200 space-y-2 text-xs text-clay-800">
              <div className="flex justify-between">
                <span className="text-sand-600">Sous-total HT :</span>
                <span className="font-mono font-semibold">{formatPrice(subtotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-600">Frais de dossier & conditionnement :</span>
                <span className="font-mono text-sage-700 font-semibold">Gratuit</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-sand-200">
                <span className="font-bold text-sm text-clay-900">Total TTC à payer :</span>
                <span className="font-serif text-2xl font-bold text-terracotta-700">
                  {formatPrice(subtotalAmount)}
                </span>
              </div>
            </div>

            {/* Reassurance Badge */}
            <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-sand-200 flex items-center gap-2.5 text-[11px] text-sand-700">
              <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
              <span>Facture officielle numérotée émise dès validation de la transaction.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Auth Modal if not connected */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-clay-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sand-300 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-clay-900 text-harvest-300 flex items-center justify-center mx-auto mb-2 font-serif font-bold text-lg">
                T
              </div>
              <h3 className="font-serif text-xl font-bold text-clay-900">
                {authMode === "login" ? "Connexion Rapide Client" : "Inscription Express"}
              </h3>
              <p className="text-xs text-sand-600">
                Finalisez votre commande et retrouvez vos factures en toute sécurité.
              </p>
            </div>

            {/* Google Sign In inside Modal */}
            <div className="space-y-3">
              <GoogleAuthButton
                text="Continuer avec Google"
                redirectTo="/checkout"
              />

              <div className="relative flex items-center justify-center">
                <div className="border-t border-sand-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] text-sand-500 font-medium uppercase tracking-wider shrink-0">
                  ou par email
                </span>
                <div className="border-t border-sand-200 w-full" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-clay-800 mb-1">
                    Nom complet / Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Ex: Coopérative Agro"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-clay-800 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 font-bold text-xs shadow-warm-sm flex items-center justify-center gap-2 transition-all"
                id="auth-submit-btn"
              >
                <span>{authLoading ? "Traitement..." : authMode === "login" ? "Se connecter" : "Créer mon compte"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo shortcut */}
            {authMode === "login" && (
              <button
                type="button"
                onClick={handleFillDemoClient}
                className="w-full py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-clay-800 text-[11px] font-medium transition-colors"
              >
                ⚡ Remplir avec le compte Client Démo (client@terranova.agri)
              </button>
            )}

            {/* Switch mode */}
            <div className="text-center text-xs text-sand-600 pt-2 border-t border-sand-100">
              {authMode === "login" ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError("");
                    }}
                    className="font-bold text-terracotta-600 hover:underline"
                  >
                    Créer un compte
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                    }}
                    className="font-bold text-terracotta-600 hover:underline"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
