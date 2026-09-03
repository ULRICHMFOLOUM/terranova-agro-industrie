import React from "react";
import { TrendingUp } from "lucide-react";

interface MetricItem {
  value: string;
  label: string;
  sub?: string;
}

interface KeyMetricsSectionProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  metadata?: string | null;
}

export function KeyMetricsSection({
  title,
  subtitle,
  badge,
  metadata,
}: KeyMetricsSectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const metrics: MetricItem[] = meta.metrics || [
    { value: "2 500+", label: "Hectares Exploités", sub: "Céréales & cultures fourragères" },
    { value: "18 000 T", label: "Volume Annuel Produit", sub: "Maïs, soja, sorgho & dérivés" },
    { value: "98.8%", label: "Taux de Germination", sub: "Sur nos semences hybrides certifiées" },
    { value: "1 250+", label: "Clients Professionnels", sub: "Provenderies, éleveurs & coopératives" },
  ];

  return (
    <section className="py-20 bg-clay-950 text-sand-50 relative overflow-hidden border-y border-clay-800">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E281F_1px,transparent_1px),linear-gradient(to_bottom,#1E281F_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay-900 border border-harvest-400/30 text-xs font-semibold text-harvest-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-sand-50">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-sand-300 font-light max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-b from-clay-900/90 to-clay-950/90 border border-clay-800/80 hover:border-harvest-400/40 shadow-warm-lg transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center group"
            >
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-harvest-400 group-hover:scale-105 transition-transform duration-300 mb-2">
                {m.value}
              </div>
              <h3 className="font-serif text-base font-semibold text-sand-100 mb-1">
                {m.label}
              </h3>
              {m.sub && (
                <p className="text-xs text-sand-400 font-light">
                  {m.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
