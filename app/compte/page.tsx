import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package,
  FileText,
  User,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Download,
  ShoppingBag,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mon Compte & Commandes | TERRANOVA AGRO-INDUSTRIE",
};

export default async function ComptePage() {
  const sessionUser = await getSession();

  if (!sessionUser) {
    redirect("/auth/login");
  }

  // Fetch full user details and orders
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="bg-sage-100 text-sage-800 border border-sage-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
            <span>Payée & Validée</span>
          </span>
        );
      case "SHIPPED":
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>En cours d&apos;expédition</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="bg-green-100 text-green-800 border border-green-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>Livrée</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-800 border border-red-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Annulée</span>
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>En attente</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col">
      <Navbar categories={categories} currentUser={user} />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Header Profile Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-clay-900 text-harvest-300 flex items-center justify-center text-xl font-serif font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-clay-900">
                  {user.name}
                </h1>
                <span className="bg-sand-200 text-clay-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-sand-600 mt-0.5">
                {user.email} {user.phone ? `• ${user.phone}` : ""} {user.city ? `• ${user.city}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-clay-900 text-harvest-300 hover:bg-clay-800 text-xs font-semibold shadow-sm"
              >
                Accéder au Back-Office Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-terracotta-600" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-clay-900">
                Historique de Mes Commandes ({user.orders.length})
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Passer une nouvelle commande</span>
            </Link>
          </div>

          {user.orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-sand-300 space-y-4">
              <Package className="w-12 h-12 text-sand-400 mx-auto opacity-50" />
              <h3 className="font-serif text-lg font-bold text-clay-800">
                Vous n&apos;avez pas encore passé de commande
              </h3>
              <p className="text-xs text-sand-600 max-w-sm mx-auto">
                Explorez notre catalogue de céréales, bétail et intrants pour passer votre première commande.
              </p>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-clay-900 text-sand-50 font-semibold text-xs hover:bg-clay-800 shadow-sm"
              >
                Explorer le catalogue
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-sand-300 shadow-warm-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-5 sm:p-6 bg-sand-100/60 border-b border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-clay-900">
                          #{order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-sand-600 font-light">
                        Passée le {formatDate(order.createdAt)} • Livraison : {order.shippingCity || "Standard"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Link
                        href={`/facture/${order.orderNumber}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sand-50 text-clay-900 border border-sand-300 text-xs font-semibold shadow-sm transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-terracotta-600" />
                        <span>Voir la Facture</span>
                      </Link>
                      <a
                        href={`/api/orders/${order.orderNumber}/invoice?download=1`}
                        target="_blank"
                        className="p-2 rounded-xl bg-sand-200 hover:bg-sand-300 text-clay-800 transition-colors"
                        title="Télécharger la facture PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="p-5 sm:p-6">
                    <div className="divide-y divide-sand-100">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 flex items-center justify-between text-xs text-clay-800"
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-clay-900">{item.productName}</span>
                            <p className="text-[11px] text-sand-600 font-mono">
                              {formatPrice(item.unitPrice)} / {item.unit} × {item.quantity}
                            </p>
                          </div>
                          <div className="font-bold font-mono text-clay-900">
                            {formatPrice(item.totalRow)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="mt-4 pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-end sm:items-center justify-between text-xs gap-2">
                      <div className="text-sand-600 text-[11px]">
                        Mode de paiement : <strong>{order.paymentMethod}</strong> (Réf : {order.paymentRef || "N/A"})
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sand-600">Total réglé TTC :</span>
                        <span className="font-serif text-lg font-bold text-terracotta-700">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
