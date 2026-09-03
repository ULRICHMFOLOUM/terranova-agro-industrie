"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [firmName, setFirmName] = useState(initialSettings.FIRM_NAME || "TERRANOVA AGRO-INDUSTRIE");
  const [tagline, setTagline] = useState(
    initialSettings.FIRM_TAGLINE || "Excellence Agro-Pastorale & Précision Industrielle"
  );
  const [phone, setPhone] = useState(initialSettings.FIRM_PHONE || "+237 690 00 00 00");
  const [whatsapp, setWhatsapp] = useState(initialSettings.FIRM_WHATSAPP || "237690000000");
  const [email, setEmail] = useState(initialSettings.FIRM_EMAIL || "contact@terranova.agri");
  const [location, setLocation] = useState(
    initialSettings.FIRM_LOCATION || "Complexe Agro-Industriel & Domaines du Noun, Cameroun"
  );
  const [currency, setCurrency] = useState(initialSettings.CURRENCY || "FCFA");

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            FIRM_NAME: firmName,
            FIRM_TAGLINE: tagline,
            FIRM_PHONE: phone,
            FIRM_WHATSAPP: whatsapp,
            FIRM_EMAIL: email,
            FIRM_LOCATION: location,
            CURRENCY: currency,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-warm-sm max-w-3xl space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-sage-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
          <span>Paramètres de la firme mis à jour avec succès !</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-clay-800 mb-1">Nom de l&apos;Entreprise / Firme *</label>
            <input
              type="text"
              required
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-clay-800 mb-1">Devise de Facturation</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-clay-800 mb-1">Slogan de Marque (Tagline)</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-clay-800 mb-1">Numéro WhatsApp Commercial *</label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="237690000000 (sans + ni espaces)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-clay-800 mb-1">Ligne Téléphonique Standard</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-clay-800 mb-1">Email Officiel</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-clay-800 mb-1">Localisation & Siège</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-sand-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 font-bold text-xs shadow-warm-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Enregistrement..." : "Sauvegarder les Paramètres"}</span>
          </button>
        </div>
      </form>

      {/* Telegram Free Instant Notifications Box */}
      <TelegramNotificationTestCard />
    </div>
  );
}

function TelegramNotificationTestCard() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleTestNotification = async () => {
    setTesting(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/test-notification", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.error || "Échec du test Telegram." });
      }
    } catch {
      setResult({ success: false, message: "Erreur de connexion au serveur." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="pt-6 border-t border-sand-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            ✈️
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-clay-900">
              Système de Notification Instantanée Gratuit (Telegram)
            </h4>
            <p className="text-[11px] text-sand-600">
              Recevez instantanément une alerte sonore avec les détails et l&apos;adresse de livraison dès qu&apos;un client passe commande.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestNotification}
          disabled={testing}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <span>{testing ? "Test en cours..." : "Tester l'Alerte Telegram"}</span>
        </button>
      </div>

      {result && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            result.success
              ? "bg-sage-50 border-sage-200 text-sage-800"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}

      <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-[11px] text-sand-700 space-y-1">
        <p className="font-bold text-clay-900">💡 Comment activer les alertes gratuites sur votre smartphone :</p>
        <ol className="list-decimal list-inside space-y-0.5 text-sand-600">
          <li>Ouvrez Telegram et recherchez <code className="bg-sand-200 px-1 py-0.5 rounded font-mono text-clay-900">@BotFather</code> puis tapez <code className="bg-sand-200 px-1 py-0.5 rounded font-mono text-clay-900">/newbot</code> pour créer votre bot.</li>
          <li>Copiez le token API fourni dans votre fichier <code className="bg-sand-200 px-1 py-0.5 rounded font-mono text-clay-900">.env</code> (<code className="font-mono">TELEGRAM_BOT_TOKEN</code>).</li>
          <li>Recherchez <code className="bg-sand-200 px-1 py-0.5 rounded font-mono text-clay-900">@userinfobot</code> pour obtenir votre ID numérique et mettez-le dans <code className="bg-sand-200 px-1 py-0.5 rounded font-mono text-clay-900">TELEGRAM_CHAT_ID</code>.</li>
        </ol>
      </div>
    </div>
  );
}
