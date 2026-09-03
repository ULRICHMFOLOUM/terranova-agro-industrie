import React from "react";
import Link from "next/link";
import { ProductCard } from "../products/ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";

interface FeaturedProductsSectionProps {
  products: any[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-sand-100/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-harvest-100 border border-harvest-300 text-xs font-semibold text-harvest-800">
              <Sparkles className="w-3.5 h-3.5 text-harvest-600" />
              <span>Sélection Prioritaire</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-clay-900 tracking-tight">
              Produits Phares & Récoltes d&apos;Élite
            </h2>
            <p className="text-sm sm:text-base text-sand-700 font-light leading-relaxed">
              Sélectionnez nos lots les plus demandés pour un approvisionnement direct avec traçabilité garantie.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-700 hover:text-terracotta-800 transition-colors group self-start md:self-auto"
          >
            <span>Consulter les {products.length} références</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              shortDesc={p.shortDesc}
              price={p.price}
              unit={p.unit}
              stock={p.stock}
              status={p.status}
              featured={p.featured}
              images={p.images}
              categoryName={p.category?.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
