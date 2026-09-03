"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ShieldCheck, PhoneCall, Sparkles } from "lucide-react";

// Chargement dynamique de la scène 3D côté client uniquement (ssr: false)
const AgroHeroScene = dynamic(() => import("../3d/AgroHeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] sm:h-[580px] lg:h-[680px] flex items-center justify-center bg-clay-950/40 rounded-3xl border border-clay-800 animate-pulse">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full border-2 border-harvest-400/40 border-t-harvest-400 animate-spin" />
        <span className="text-xs text-harvest-300 font-serif tracking-widest uppercase">Initialisation 3D Precision...</span>
      </div>
    </div>
  ),
});

interface HeroSectionProps {
  title: string;
  subtitle?: string | null;
  content?: string | null;
  badge?: string | null;
  metadata?: string | null;
}

export function HeroSection({ title, subtitle, content, badge, metadata }: HeroSectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const primaryCtaText = meta.primaryCtaText || "Explorer le Catalogue";
  const primaryCtaLink = meta.primaryCtaLink || "/catalogue";
  const secondaryCtaText = meta.secondaryCtaText || "Commander sur WhatsApp";
  const secondaryCtaLink = meta.secondaryCtaLink || "https://wa.me/237690000000";
  const statsBadge = meta.statsBadge || "99.2% Pureté Certifiée";

  return (
    <section className="relative min-h-[92vh] bg-clay-950 text-sand-50 pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-clay-800/60 via-clay-950 to-clay-950 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-terracotta-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Story & Impact Typography */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-clay-800/80 border border-harvest-400/30 text-xs font-semibold text-harvest-300 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-harvest-400 animate-pulse" />
              <span>{badge || "Domaines & Usines Certifiés"}</span>
              <span className="w-1 h-1 rounded-full bg-harvest-400" />
              <span className="text-sand-300 font-normal">{statsBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-sand-50">
              {title}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base lg:text-lg text-sand-200 leading-relaxed max-w-2xl font-light">
              {subtitle || content}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href={primaryCtaLink}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 hover:from-terracotta-600 hover:to-terracotta-800 text-white font-bold text-sm shadow-warm-lg shadow-terracotta-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                id="hero-catalogue-cta"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={secondaryCtaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-clay-800/90 hover:bg-clay-700 text-sand-100 text-sm font-medium border border-clay-700 hover:border-harvest-400/40 transition-all backdrop-blur-sm"
              >
                <PhoneCall className="w-4 h-4 text-[#25D366]" />
                <span>{secondaryCtaText}</span>
              </a>
            </div>

            {/* Key trust bullets */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-clay-800/80 text-xs text-sand-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-harvest-400 shrink-0" />
                <span>Paiement MoMo / OM</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span>Facture PDF Instantanée</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sage-400 shrink-0" />
                <span>Livraison Sécurisée</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Hero Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-clay-900/60 to-clay-950/90 border border-clay-800/80 shadow-2xl p-2">
              <AgroHeroScene />
              <div className="absolute bottom-4 left-6 right-6 text-center pointer-events-none">
                <span className="text-[11px] font-mono tracking-widest text-sand-400/80 uppercase bg-clay-950/70 px-3 py-1 rounded-full border border-clay-800">
                  Modèle 3D Interactif • Faites défiler pour explorer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
