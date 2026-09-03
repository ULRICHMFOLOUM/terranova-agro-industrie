"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ShoppingBag, Eye, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "../cart/CartContext";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  price: number;
  unit: string;
  stock: number;
  status: string;
  featured?: boolean;
  images: string; // JSON array of string URLs
  categoryName?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  shortDesc,
  price,
  unit,
  stock,
  status,
  featured,
  images,
  categoryName,
}: ProductCardProps) {
  const { addItem } = useCart();

  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(images);
  } catch {
    parsedImages = [images];
  }
  const mainImage = parsedImages[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600";

  const isOutOfStock = status === "OUT_OF_STOCK" || stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem({
      id,
      name,
      slug,
      price,
      unit,
      image: mainImage,
      stock,
    }, 1);
  };

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white border border-sand-300 shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200">
        <Link href={`/produits/${slug}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-clay-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {featured && (
            <span className="bg-harvest-500 text-clay-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              ★ Sélection Élite
            </span>
          )}
          {categoryName && (
            <span className="bg-clay-950/80 backdrop-blur-sm text-sand-200 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-clay-800">
              {categoryName}
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-red-700/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Rupture temporaire
            </span>
          ) : (
            <span className="bg-sage-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>En stock ({stock})</span>
            </span>
          )}
        </div>

        {/* Quick View Hover Link */}
        <Link
          href={`/produits/${slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-clay-950/25 transition-opacity"
        >
          <span className="px-4 py-2 rounded-full bg-white/95 text-clay-900 text-xs font-semibold shadow-warm-md flex items-center gap-1.5 hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Fiche technique</span>
          </span>
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/produits/${slug}`}>
            <h3 className="font-serif font-bold text-sm sm:text-base text-clay-900 hover:text-terracotta-600 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          {shortDesc && (
            <p className="text-xs text-sand-700 line-clamp-2 mt-1 leading-relaxed font-light">
              {shortDesc}
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-sand-500 uppercase tracking-wider block">Prix unitaire</span>
            <div className="font-serif text-base font-bold text-terracotta-700">
              {formatPrice(price)}
              <span className="text-[11px] font-sans font-normal text-sand-600 ml-1">/ {unit}</span>
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? "bg-sand-200 text-sand-400 cursor-not-allowed"
                : "bg-clay-900 hover:bg-terracotta-600 text-white shadow-warm-sm hover:scale-105 active:scale-95"
            }`}
            title={isOutOfStock ? "Produit en rupture" : "Ajouter au panier"}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
