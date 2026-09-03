"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppOrderLink } from "@/lib/fapshi";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    subtotalAmount,
    clearCart,
  } = useCart();

  const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237690000000";

  const whatsAppLink = generateWhatsAppOrderLink({
    phone: whatsAppNumber,
    customerName: "Client en ligne",
    items: items.map((it) => ({
      name: it.name,
      quantity: it.quantity,
      unit: it.unit,
      price: it.price,
    })),
    total: subtotalAmount,
  });

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-clay-950/60 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-sand-50 text-clay-900 shadow-2xl z-50 flex flex-col border-l border-sand-300"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-sand-200 flex items-center justify-between bg-sand-100/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-terracotta-100 text-terracotta-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-clay-900">
                    Mon Panier d&apos;Achat
                  </h3>
                  <p className="text-xs text-sand-500">
                    {totalItems} {totalItems > 1 ? "articles sélectionnés" : "article sélectionné"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-sand-500 hover:text-clay-900 hover:bg-sand-200 transition-colors"
                title="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center text-sand-500">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-lg text-clay-800">
                      Votre panier est vide
                    </h4>
                    <p className="text-xs text-sand-500 mt-1 max-w-xs">
                      Découvrez nos céréales de qualité, notre bétail sélectionné et nos intrants agricoles.
                    </p>
                  </div>
                  <Link
                    href="/catalogue"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-clay-900 text-sand-50 text-xs font-semibold hover:bg-clay-800 transition-colors shadow-sm"
                  >
                    <span>Explorer le catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-2xl bg-white border border-sand-200 shadow-warm-sm transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=300"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/produits/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-semibold text-xs text-clay-900 hover:text-terracotta-600 line-clamp-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sand-400 hover:text-red-600 p-1 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-terracotta-700 font-bold mt-1">
                        {formatPrice(item.price)} <span className="text-[11px] font-normal text-sand-500">/ {item.unit}</span>
                      </div>

                      {/* Quantity Selector & Row Total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-sand-100">
                        <div className="flex items-center bg-sand-100 rounded-lg p-0.5 border border-sand-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded text-clay-700 hover:bg-sand-200 transition-colors"
                            title="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold font-mono text-clay-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded text-clay-700 hover:bg-sand-200 transition-colors"
                            title="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-bold font-mono text-clay-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & CTAs */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-sand-200 bg-sand-100/80 space-y-3">
                {/* Subtotal row */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-clay-700 font-medium">Sous-total HT :</span>
                  <span className="font-serif font-bold text-lg text-clay-900">
                    {formatPrice(subtotalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-sage-600 bg-sage-50 px-2.5 py-1.5 rounded-lg border border-sage-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                  <span>Paiement sécurisé par Fapshi (Orange Money & MTN MoMo)</span>
                </div>

                {/* Primary CTA: Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md transition-all active:scale-[0.99]"
                  id="cart-checkout-btn"
                >
                  <span>Valider la commande</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Alternative CTA: WhatsApp Order */}
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Commander directement sur WhatsApp</span>
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
