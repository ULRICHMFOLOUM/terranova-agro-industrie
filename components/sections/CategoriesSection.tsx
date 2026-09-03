import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productsCount?: number;
}

interface CategoriesSectionProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  categories: CategoryItem[];
}

export function CategoriesSection({
  title,
  subtitle,
  badge,
  categories = [],
}: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-sand-100/60 relative overflow-hidden" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 border border-sand-300 text-xs font-semibold text-terracotta-700">
                <Layers className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-clay-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-sand-700 font-light leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-700 hover:text-terracotta-800 transition-colors group self-start md:self-auto"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/catalogue?category=${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-sand-300 shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-56 w-full overflow-hidden bg-sand-200">
                <Image
                  src={cat.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clay-950/80 via-clay-950/20 to-transparent" />
                
                {/* Category Number Pill */}
                <div className="absolute top-4 left-4 bg-clay-950/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-harvest-300 border border-harvest-400/30">
                  Filière 0{idx + 1}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl font-bold text-sand-50 group-hover:text-harvest-300 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-sand-700 line-clamp-3 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-sand-100 text-xs font-semibold text-clay-900 group-hover:text-terracotta-600 transition-colors">
                  <span>Consulter la filière</span>
                  <div className="w-8 h-8 rounded-full bg-sand-100 group-hover:bg-terracotta-100 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
