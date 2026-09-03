import React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface PhotoItem {
  url: string;
  title: string;
}

interface GallerySectionProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  metadata?: string | null;
}

export function GallerySection({
  title,
  subtitle,
  badge,
  metadata,
}: GallerySectionProps) {
  let meta: any = {};
  try {
    if (metadata) meta = JSON.parse(metadata);
  } catch {}

  const photos: PhotoItem[] = meta.photos || [
    { url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800", title: "Cultures de céréales en terrasses" },
    { url: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=800", title: "Pâturages bovins de haute altitude" },
    { url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800", title: "Conditionnement certifié en entrepôt" },
    { url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800", title: "Irrigation solaire automatisée" },
  ];

  return (
    <section className="py-20 bg-sand-100/50 relative overflow-hidden" id="galerie">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 border border-sand-300 text-xs font-semibold text-terracotta-700">
              <Camera className="w-3.5 h-3.5" />
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((p, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 h-64 sm:h-72 border border-sand-300"
            >
              <Image
                src={p.url}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clay-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-serif font-bold text-sand-50 group-hover:text-harvest-300 transition-colors">
                  {p.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
