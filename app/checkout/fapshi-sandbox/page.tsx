"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Smartphone, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

function FapshiSandboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transId = searchParams.get("transId") || "FPSH-MOCK-2026";
  const orderNumber = searchParams.get("orderNumber") || "";
  const amountStr = searchParams.get("amount") || "0";
  const amount = parseFloat(amountStr);

  const [operator, setOperator] = useState<"MTN" | "ORANGE">("MTN");
  const [phoneNumber, setPhoneNumber] = useState("670000000");
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS" | "FAILED">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSimulatePayment = async () => {
    setStatus("PROCESSING");
    setErrorMessage("");

    try {
      // Envoyer le statut au webhook Fapshi
      const res = await fetch("/api/webhook/fapshi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transId,
          externalId: orderNumber,
          status: "SUCCESSFUL",
          amount,
          operator,
          phone: phoneNumber,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de confirmation du webhook");
      }

      setStatus("SUCCESS");
      setTimeout(() => {
        router.push(`/checkout/success?orderNumber=${orderNumber}`);
      }, 1200);
    } catch (err: any) {
      setStatus("FAILED");
      setErrorMessage(err?.message || "Erreur de validation");
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay-900 text-harvest-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-harvest-400" />
          <span>Passerelle Sécurisée Fapshi • Mode Test MoMo / OM</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-clay-900">
          Validation de Paiement Mobile
        </h2>
        <p className="text-xs text-sand-600">
          Commande Réf. : <strong>#{orderNumber}</strong>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-warm-lg rounded-3xl border border-sand-300 space-y-6">
          {/* Amount Display */}
          <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 text-center">
            <span className="text-xs text-sand-500 block">Montant à débiter</span>
            <span className="font-serif text-3xl font-bold text-terracotta-700">
              {formatPrice(amount)}
            </span>
          </div>

          {/* Operator Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-clay-800">
              Sélectionnez votre opérateur Mobile Money :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setOperator("MTN");
                  setPhoneNumber("670000000");
                }}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  operator === "MTN"
                    ? "border-[#FFCC00] bg-[#FFCC00]/10 text-clay-900 font-bold"
                    : "border-sand-200 text-sand-600 hover:border-sand-300"
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#E5B800]" />
                <span className="text-xs">MTN MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOperator("ORANGE");
                  setPhoneNumber("690000000");
                }}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  operator === "ORANGE"
                    ? "border-[#FF6600] bg-[#FF6600]/10 text-clay-900 font-bold"
                    : "border-sand-200 text-sand-600 hover:border-sand-300"
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#FF6600]" />
                <span className="text-xs">Orange Money</span>
              </button>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-clay-800">
              Numéro de téléphone de facturation :
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs font-mono font-bold focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Status feedback */}
          {status === "PROCESSING" && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
              <span>Attente de validation du prompt USSD sur le téléphone...</span>
            </div>
          )}

          {status === "SUCCESS" && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Paiement validé avec succès ! Redirection vers la facture...</span>
            </div>
          )}

          {status === "FAILED" && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={status === "PROCESSING" || status === "SUCCESS"}
            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-clay-900 to-clay-800 hover:from-terracotta-600 hover:to-terracotta-700 text-sand-50 font-bold text-xs shadow-warm-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            id="fapshi-confirm-btn"
          >
            <span>Confirmer & Payer {formatPrice(amount)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-sand-500">
            Environnement de test Fapshi sécurisé • Aucune transaction bancaire réelle débitée en mode sandbox.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FapshiSandboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Chargement simulateur...</div>}>
      <FapshiSandboxContent />
    </Suspense>
  );
}
