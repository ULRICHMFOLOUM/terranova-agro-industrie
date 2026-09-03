"use client";

import React, { useEffect, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt({ variant = "button" }: { variant?: "button" | "banner" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Vérifier si l'application est déjà lancée en mode standalone / PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instruction si le navigateur ne déclenche pas le prompt automatique (ex: iOS Safari)
      alert(
        "Pour installer l'application TERRANOVA :\n• Sur iOS Safari : Touchez 'Partager' puis 'Sur l'écran d'accueil'.\n• Sur Android Chrome : Touchez les 3 points du menu puis 'Installer l'application'."
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn("Installation error:", err);
    }
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleInstallClick}
        type="button"
        title="Installer l'application TERRANOVA sur votre appareil"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sand-200/80 hover:bg-terracotta-100 text-clay-800 border border-sand-300 transition-all shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-terracotta-600" />
        <span>Installer l&apos;App</span>
      </button>
    );
  }

  return (
    <div className="bg-clay-900 border-b border-terracotta-500/30 text-sand-100 px-4 py-2 text-xs flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-harvest-400 shrink-0" />
        <span>
          <strong>Installez TERRANOVA</strong> pour un accès instantané au catalogue et un suivi hors-ligne de vos commandes.
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-terracotta-500 to-harvest-500 hover:from-terracotta-600 hover:to-harvest-600 text-white px-3 py-1 rounded font-semibold text-xs transition-all shadow-sm"
        >
          Installer
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-sand-400 hover:text-sand-100 text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
