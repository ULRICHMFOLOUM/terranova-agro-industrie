import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  FileText,
  Download,
  Package,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { ConfettiTrigger } from "./ConfettiTrigger";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Commande Confirmée | TERRANOVA AGRO-INDUSTRIE",
};

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.orderNumber;
  const user = await getSession();

  if (!orderNumber) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col">
      <Navbar categories={categories} currentUser={user} />
      <ConfettiTrigger />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-warm-lg border border-sand-300 space-y-8 text-center sm:text-left">
          {/* Top Success Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-sand-200 pb-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-3xl bg-sage-100 text-sage-700 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-sage-600" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-sage-700 uppercase tracking-widest block">
                Paiement & Commande Validés
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clay-900">
                Merci pour votre confiance, {order.customerName} !
              </h1>
              <p className="text-xs text-sand-600">
                Un email de confirmation récapitulatif a été transmis à <strong>{order.customerEmail}</strong>.
              </p>
            </div>
          </div>

          {/* Key Reference Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
              <span className="text-sand-500 block mb-0.5">Numéro de commande</span>
              <span className="font-mono font-bold text-clay-900 text-sm">{order.orderNumber}</span>
            </div>
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
              <span className="text-sand-500 block mb-0.5">Date & Heure</span>
              <span className="font-semibold text-clay-900">{formatDate(order.createdAt)}</span>
            </div>
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
              <span className="text-sand-500 block mb-0.5">Montant Réglé</span>
              <span className="font-serif font-bold text-terracotta-700 text-sm">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-clay-900 border-b border-sand-100 pb-2">
              Détail des Produits Commandés
            </h3>
            <div className="divide-y divide-sand-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-clay-900">{item.productName}</span>
                    <p className="text-[11px] text-sand-500 font-mono">
                      {formatPrice(item.unitPrice)} / {item.unit} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-clay-900">{formatPrice(item.totalRow)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline text-xs">
              <span className="font-bold text-clay-900">Total Facturé :</span>
              <span className="font-serif text-xl font-bold text-terracotta-700">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Action CTAs: Download Invoice & Portal */}
          <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href={`/facture/${order.orderNumber}`}
                target="_blank"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-clay-900 hover:bg-clay-800 text-sand-50 font-bold text-xs shadow-warm-sm transition-all"
                id="view-invoice-btn"
              >
                <FileText className="w-4 h-4 text-harvest-400" />
                <span>Afficher la Facture PDF</span>
              </Link>

              <a
                href={`/api/orders/${order.orderNumber}/invoice?download=1`}
                target="_blank"
                className="inline-flex items-center justify-center p-3 rounded-2xl bg-sand-200 hover:bg-sand-300 text-clay-800 transition-colors"
                title="Télécharger directement la facture PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href="/compte"
                className="text-xs font-semibold text-terracotta-600 hover:underline"
              >
                Accéder à mon espace client &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
