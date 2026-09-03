import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Aggregate Metrics from Database
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const products = await prisma.product.findMany({
    include: { category: true },
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
  });

  const paidOrders = orders.filter((o) => o.status === "PAID" || o.paymentStatus === "SUCCESS");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const averageBasket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock <= 0 || p.status === "OUT_OF_STOCK").length;

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Chiffre d'affaires */}
        <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-sand-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Chiffre d&apos;Affaires Encaissé</span>
            <div className="p-2 rounded-xl bg-terracotta-50 text-terracotta-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-clay-900">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[11px] text-sage-600 font-semibold block">
            {paidOrders.length} commande(s) réglée(s)
          </span>
        </div>

        {/* Card 2: Commandes */}
        <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-sand-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total des Commandes</span>
            <div className="p-2 rounded-xl bg-harvest-50 text-harvest-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-clay-900">
            {totalOrdersCount}
          </div>
          <span className="text-[11px] text-sand-600 block">
            Panier moyen : {formatPrice(averageBasket)}
          </span>
        </div>

        {/* Card 3: Catalogue & Stocks */}
        <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-sand-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Références Produits</span>
            <div className="p-2 rounded-xl bg-clay-100 text-clay-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-clay-900">
            {products.length}
          </div>
          <span className="text-[11px] text-sand-600 block">
            {totalStockItems} unités en stock disponible
          </span>
        </div>

        {/* Card 4: Familles & Filières */}
        <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-sand-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Familles de Produits</span>
            <div className="p-2 rounded-xl bg-sage-50 text-sage-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-clay-900">
            {categories.length}
          </div>
          <span className="text-[11px] text-sand-600 block">
            {outOfStockCount > 0 ? (
              <span className="text-red-600 font-bold">{outOfStockCount} produit(s) en rupture</span>
            ) : (
              <span className="text-sage-600">Tous les stocks sont approvisionnés</span>
            )}
          </span>
        </div>
      </div>

      {/* Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-sand-300 shadow-warm-sm space-y-5">
          <div className="flex items-center justify-between border-b border-sand-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-clay-900">
              Dernières Commandes Clients
            </h3>
            <Link
              href="/admin/commandes"
              className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-sand-600 py-6 text-center">Aucune commande enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-sand-200 text-sand-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Commande</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Montant</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3 text-right">Facture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-clay-900">{o.orderNumber}</td>
                      <td className="py-3.5 font-medium">{o.customerName}</td>
                      <td className="py-3.5 text-sand-600 font-mono">{formatDate(o.createdAt)}</td>
                      <td className="py-3.5 font-serif font-bold text-terracotta-700">
                        {formatPrice(o.totalAmount)}
                      </td>
                      <td className="py-3.5">
                        {o.status === "PAID" ? (
                          <span className="px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 text-[10px] font-bold">
                            Payée
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/facture/${o.orderNumber}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-terracotta-600 hover:text-terracotta-700 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown & Management Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-sand-300 shadow-warm-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-clay-900 border-b border-sand-100 pb-3">
              Répartition par Filière
            </h3>

            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-clay-800">{c.name}</span>
                  <span className="font-mono font-bold bg-sand-100 px-2.5 py-0.5 rounded-full text-sand-700">
                    {c._count.products} produit(s)
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-sand-100">
              <Link
                href="/admin/categories"
                className="block text-center py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-clay-900 font-semibold text-xs transition-colors"
              >
                Gérer les Catégories &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-clay-950 to-clay-900 text-sand-50 rounded-3xl p-6 border border-harvest-400/30 shadow-warm-md space-y-3">
            <span className="text-xs font-mono text-harvest-400 font-bold uppercase">CMS Dynamique</span>
            <h4 className="font-serif text-base font-bold">Personnalisez votre Page d&apos;Accueil</h4>
            <p className="text-xs text-sand-300 font-light leading-relaxed">
              Ajoutez de nouvelles sections, réorganisez l&apos;ordre d&apos;apparition et modifiez vos photos sans toucher au code.
            </p>
            <Link
              href="/admin/sections"
              className="inline-block px-4 py-2 rounded-xl bg-harvest-400 hover:bg-harvest-500 text-clay-950 font-bold text-xs transition-colors shadow-sm"
            >
              Éditeur de Sections &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
