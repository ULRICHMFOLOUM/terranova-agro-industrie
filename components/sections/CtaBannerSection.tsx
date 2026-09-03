import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react";

interface CtaBannerSectionProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  metadata?: string | null;
}

export function CtaBannerSection({
  title,
  subtitle,
  badge,
  metadata,
}: CtaBannerSectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const primaryBtn = meta.primaryBtn || { text: "Commander en Ligne", link: "/catalogue" };
  const secondaryBtn = meta.secondaryBtn || { text: "Contacter le Service Commercial", link: "https://wa.me/237690000000" };

  return (
    <section className="py-20 bg-sand-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-clay-950 via-clay-900 to-clay-800 text-sand-50 p-8 sm:p-14 lg:p-16 border border-harvest-400/30 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-harvest-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-clay-800/90 border border-harvest-400/40 text-xs font-semibold text-harvest-300">
                <Sparkles className="w-3.5 h-3.5 text-harvest-400" />
                <span>{badge}</span>
              </div>
            )}

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-sand-50 leading-tight">
              {title}
            </h2>

            {subtitle && (
              <p className="text-sm sm:text-base text-sand-200 font-light leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href={primaryBtn.link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-bold text-sm shadow-warm-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{primaryBtn.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={secondaryBtn.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-clay-800/80 hover:bg-clay-700 text-sand-100 text-sm font-medium border border-clay-700 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#25D366]" />
                <span>{secondaryBtn.text}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
