import React from "react";
import { MessageSquareQuote, Star, MapPin } from "lucide-react";

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  location: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  metadata?: string | null;
}

export function TestimonialsSection({
  title,
  subtitle,
  badge,
  metadata,
}: TestimonialsSectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const testimonials: TestimonialItem[] = meta.testimonials || [
    {
      quote: "Le maïs jaune fourni par TERRANOVA présente une régularité de séchage et une pureté inégalées. Nos rendements en provende ont augmenté de 12%.",
      author: "Ing. Michel Kamga",
      role: "Directeur Technique, Nutri-Agro Provenderie",
      location: "Bafoussam",
    },
    {
      quote: "Nous avons acquis 8 génisses Goudali et 1 taureau. La vitalité des bêtes et le suivi vétérinaire post-achat sont exceptionnels.",
      author: "Dr. Oumarou Sali",
      role: "Président de la Fédération Pastorale du Nord",
      location: "Garoua",
    },
    {
      quote: "Le paiement instantané Mobile Money et la réception directe de la facture PDF nous font gagner un temps précieux dans notre gestion comptable.",
      author: "Clarisse Ngo Bikoi",
      role: "Gérante des Établissements Bio-Vivres",
      location: "Douala",
    },
  ];

  return (
    <section className="py-24 bg-sand-50 relative overflow-hidden" id="temoignages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 border border-sand-300 text-xs font-semibold text-terracotta-700">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-clay-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-sand-700 font-light max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-sand-300 shadow-warm-md flex flex-col justify-between space-y-6 relative hover:border-harvest-400/60 transition-colors"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-harvest-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-clay-800 italic leading-relaxed font-light">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div className="pt-4 border-t border-sand-100 flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-clay-900">{t.author}</h4>
                  <p className="text-[11px] text-terracotta-600 font-medium">{t.role}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-sand-500 font-mono">
                  <MapPin className="w-3 h-3 text-terracotta-500" />
                  <span>{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
