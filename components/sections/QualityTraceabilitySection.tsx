import React from "react";
import Image from "next/image";
import { ShieldCheck, QrCode, FileCheck, Check } from "lucide-react";

interface QualityTraceabilitySectionProps {
  title: string;
  subtitle?: string | null;
  content?: string | null;
  badge?: string | null;
  mediaUrl?: string | null;
  metadata?: string | null;
}

export function QualityTraceabilitySection({
  title,
  subtitle,
  content,
  badge,
  mediaUrl,
  metadata,
}: QualityTraceabilitySectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const certifications = meta.certifications || [
    { name: "Analyses de Pureté et Humidité", desc: "Triage optique et séchage thermo-contrôlé à 12.5% max." },
    { name: "Passeport Sanitaire & Vétérinaire", desc: "Carnet vaccinal complet et échographie pour chaque bête." },
    { name: "Conditionnement Micro-Perforé", desc: "Sacs étanches protégeant contre l'oxydation et l'humidité." },
  ];

  return (
    <section className="py-24 bg-sand-100/70 relative overflow-hidden" id="tracabilite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Description & Certifications */}
          <div className="lg:col-span-7 space-y-6">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 border border-sand-300 text-xs font-semibold text-terracotta-700">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-clay-900 tracking-tight leading-tight">
              {title}
            </h2>

            {subtitle && (
              <p className="text-sm sm:text-base text-clay-700 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}

            {content && (
              <p className="text-xs sm:text-sm text-sand-700 font-light leading-relaxed">
                {content}
              </p>
            )}

            {/* Certifications list */}
            <div className="space-y-4 pt-2">
              {certifications.map((c: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-sand-200 shadow-warm-sm flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-clay-900">{c.name}</h4>
                    <p className="text-xs text-sand-600 mt-0.5 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lab image with QR badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-warm-xl border border-sand-300 h-80 sm:h-96">
              <Image
                src={mediaUrl || "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200"}
                alt="Laboratoire agronomique et contrôle qualité"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clay-950/80 via-transparent to-transparent" />

              {/* QR Verification Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-clay-950/90 backdrop-blur-md border border-harvest-400/30 text-sand-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-harvest-400 text-clay-950">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-harvest-300">Certificat de Lot Numérique</span>
                    <span className="text-[10px] text-sand-300 font-mono">Lot #TRN-2026-N99</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold bg-sage-500/20 text-sage-300 px-2 py-1 rounded border border-sage-500/40">
                  100% Conforme
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
