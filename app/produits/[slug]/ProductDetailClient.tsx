"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, PhoneCall, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { generateWhatsAppOrderLink } from "@/lib/fapshi";
import { formatPrice } from "@/lib/utils";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    stock: number;
    status: string;
    images: string[];
    shortDesc?: string | null;
    description: string;
    specs: Record<string, string>;
    categoryName: string;
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock <= 0;
  const currentImage = product.images[selectedImageIndex] || product.images[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800";

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      unit: product.unit,
      image: currentImage,
      stock: product.stock,
    }, quantity);

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const whatsAppLink = generateWhatsAppOrderLink({
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237690000000",
    customerName: "Client en ligne",
    items: [
      {
        name: product.name,
        quantity,
        unit: product.unit,
        price: product.price,
      },
    ],
    total: product.price * quantity,
  });

  return (
    <div className="space-y-6">
      {/* Main Image Stage */}
      <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-sand-200 border border-sand-300 shadow-warm-lg">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover transition-all duration-500"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clay-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Stock Badge Overlay */}
        <div className="absolute top-4 right-4">
          {isOutOfStock ? (
            <span className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Rupture de stock
            </span>
          ) : (
            <span className="bg-clay-950/80 backdrop-blur-md text-harvest-300 text-xs font-semibold px-3 py-1 rounded-full border border-harvest-400/40 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-harvest-400" />
              <span>En stock ({product.stock} {product.unit}s disponibles)</span>
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails list if multiple images exist */}
      {product.images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedImageIndex === idx
                  ? "border-terracotta-600 scale-105 shadow-md"
                  : "border-sand-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${product.name} - ${idx}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Quantity Selector & Action Buttons */}
      <div className="p-6 rounded-3xl bg-white border border-sand-300 shadow-warm-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-sand-600">Quantité ({product.unit}) :</span>
            <div className="flex items-center bg-sand-100 rounded-2xl p-1 border border-sand-200 w-fit">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-clay-800 hover:bg-sand-200 transition-colors disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-14 text-center font-mono font-bold text-sm text-clay-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-clay-800 hover:bg-sand-200 transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtotal preview */}
          <div className="text-right">
            <span className="text-xs font-medium text-sand-600">Montant total sélectionné :</span>
            <div className="font-serif text-xl font-bold text-clay-900">
              {formatPrice(product.price * quantity)}
            </div>
          </div>
        </div>

        {/* Primary CTA: Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-4 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-warm-md ${
              isOutOfStock
                ? "bg-sand-200 text-sand-400 cursor-not-allowed"
                : "bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 hover:from-terracotta-600 hover:to-terracotta-800 text-white hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{addedAnimation ? "✓ Ajouté au panier !" : "Ajouter au panier"}</span>
          </button>

          {/* WhatsApp Direct CTA */}
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noreferrer"
            className="py-3.5 px-6 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <PhoneCall className="w-4 h-4 text-[#25D366]" />
            <span>Commander ce lot par WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
