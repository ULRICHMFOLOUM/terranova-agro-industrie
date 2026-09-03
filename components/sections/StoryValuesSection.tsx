import React from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Cpu, Leaf } from "lucide-react";

interface StoryValuesSectionProps {
  title: string;
  subtitle?: string | null;
  content?: string | null;
  badge?: string | null;
  mediaUrl?: string | null;
  secondaryMediaUrl?: string | null;
  metadata?: string | null;
}

export function StoryValuesSection({
  title,
  subtitle,
  content,
  badge,
  mediaUrl,
  secondaryMediaUrl,
  metadata,
}: StoryValuesSectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const points = meta.points || [
    { title: "Génétique Pastorale Élite", desc: "Croisements contrôlés pour une robustesse et une productivité maximale." },
    { title: "Silos Industriels Thermo-Régulés", desc: "Stockage sous atmosphère contrôlée prévenant l'humidité et les ravageurs." },
    { title: "Pratiques Éco-Responsables", desc: "Compostage biologique, circuits courts et irrigation solaire raisonnée." },
  ];

  return (
    <section className="py-24 bg-sand-50 relative overflow-hidden" id="valeurs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with 2 Images */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-warm-xl border border-sand-300 h-96 sm:h-[480px]">
              <Image
                src={mediaUrl || "https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=1200"}
                alt="Silos agro-industriels TERRANOVA"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clay-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-sand-50">
                <span className="text-[11px] font-mono tracking-widest text-harvest-300 uppercase block">Infrastructure</span>
                <span className="font-serif text-lg font-bold">15 000 Tonnes de Stockage Sécurisé</span>
              </div>
            </div>

            {/* Overlapping Secondary Image */}
            {secondaryMediaUrl && (
              <div className="hidden sm:block absolute -bottom-8 -right-8 w-64 h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-sand-50 z-20">
                <Image
                  src={secondaryMediaUrl}
                  alt="Cultures agricoles durables"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            )}

            {/* Floating Trust Badge */}
            <div className="absolute top-6 -left-4 sm:-left-6 bg-clay-900 text-sand-50 p-4 rounded-2xl shadow-warm-lg border border-harvest-400/40 z-20 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-terracotta-500 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-harvest-300">Normes Internationales</span>
                <span className="text-[11px] text-sand-300">Traçabilité du champ à l&apos;usine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text & Feature Cards */}
          <div className="lg:col-span-6 space-y-6">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 border border-sand-300 text-xs font-semibold text-terracotta-700">
                <Cpu className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-clay-900 tracking-tight leading-tight">
              {title}
            </h2>

            {subtitle && (
              <p className="text-base text-clay-700 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}

            {content && (
              <p className="text-xs sm:text-sm text-sand-700 font-light leading-relaxed">
                {content}
              </p>
            )}

            {/* Key Value Points */}
            <div className="pt-4 space-y-4">
              {points.map((pt: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-sand-100/80 border border-sand-200 flex items-start gap-3.5 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-clay-900 text-harvest-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-clay-900">{pt.title}</h4>
                    <p className="text-xs text-sand-700 mt-0.5 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
