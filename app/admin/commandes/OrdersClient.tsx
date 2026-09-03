"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderItemData {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  totalRow: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  customerNotes?: string | null;
  subtotal: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef?: string | null;
  invoiceNumber?: string | null;
  createdAt: string | Date;
  items: OrderItemData[];
}

export function OrdersClient({ initialOrders }: { initialOrders: OrderData[] }) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch {
      alert("Erreur mise à jour");
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="bg-sage-100 text-sage-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Payée
          </span>
        );
      case "SHIPPED":
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Expédiée
          </span>
        );
      case "DELIVERED":
        return (
          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Livrée
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Annulée
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            En attente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par numéro, nom client, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs">
          {[
            { id: "ALL", label: "Toutes" },
            { id: "PENDING", label: "En attente" },
            { id: "PAID", label: "Payées" },
            { id: "SHIPPED", label: "Expédiées" },
            { id: "DELIVERED", label: "Livrées" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
                statusFilter === tab.id
                  ? "bg-clay-900 text-sand-50 font-bold shadow-sm"
                  : "bg-white text-clay-700 border border-sand-300 hover:bg-sand-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-sand-300 shadow-warm-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-sand-100/70 border-b border-sand-200 text-sand-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">N° Commande</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Paiement</th>
                <th className="py-3.5 px-4">Montant Total</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sand-500">
                    Aucune commande trouvée pour ces filtres.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-clay-900">{o.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-clay-900 block">{o.customerName}</span>
                      <span className="text-[11px] text-sand-500 font-mono">{o.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sand-600 font-mono">{formatDate(o.createdAt)}</td>
                    <td className="py-3.5 px-4 font-medium">{o.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-terracotta-700">
                      {formatPrice(o.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(o.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-clay-800 transition-colors"
                          title="Détails de la commande"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/facture/${o.orderNumber}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-sand-100 hover:bg-terracotta-100 text-terracotta-700 transition-colors"
                          title="Facture PDF"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-clay-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-300 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-clay-900">
                    Commande #{selectedOrder.orderNumber}
                  </h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-sand-500 font-mono mt-0.5">
                  Émise le {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-sand-400 hover:text-clay-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 block">
                Informations Destinataire
              </span>
              <div className="font-bold text-clay-900">{selectedOrder.customerName}</div>
              <div className="flex items-center gap-2 text-sand-700">
                <Phone className="w-3.5 h-3.5 text-sand-500" />
                <span>{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sand-700">
                <Mail className="w-3.5 h-3.5 text-sand-500" />
                <span>{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex items-start gap-2 text-sand-700">
                <MapPin className="w-3.5 h-3.5 text-sand-500 shrink-0 mt-0.5" />
                <span>
                  {selectedOrder.shippingAddress} ({selectedOrder.shippingCity})
                </span>
              </div>
              {selectedOrder.customerNotes && (
                <div className="pt-2 border-t border-sand-200 text-sand-600 italic">
                  &laquo; {selectedOrder.customerNotes} &raquo;
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-clay-900">Articles Inclus</h4>
              <div className="divide-y divide-sand-100 border border-sand-200 rounded-2xl p-3 bg-white">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-clay-900">{item.productName}</span>
                      <p className="text-[11px] text-sand-500 font-mono">
                        {formatPrice(item.unitPrice)} / {item.unit} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-clay-900">
                      {formatPrice(item.totalRow)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline pt-2 text-xs">
                <span className="font-bold text-clay-900">Total Encaissé :</span>
                <span className="font-serif text-xl font-bold text-terracotta-700">
                  {formatPrice(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="pt-4 border-t border-sand-200 space-y-3">
              <label className="block text-xs font-semibold text-clay-800">
                Modifier le statut logistique :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {["PENDING", "PAID", "SHIPPED", "DELIVERED"].map((st) => (
                  <button
                    key={st}
                    disabled={statusUpdating || selectedOrder.status === st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`py-2 rounded-xl font-semibold transition-all ${
                      selectedOrder.status === st
                        ? "bg-clay-900 text-sand-50 font-bold"
                        : "bg-sand-100 hover:bg-sand-200 text-clay-800"
                    }`}
                  >
                    {st === "PENDING" && "En attente"}
                    {st === "PAID" && "Payée"}
                    {st === "SHIPPED" && "Expédiée"}
                    {st === "DELIVERED" && "Livrée"}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Dispatch & WhatsApp Communication */}
            <div className="pt-2 border-t border-sand-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block">
                Actions Logistique & Livraison
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Bonjour ${selectedOrder.customerName}, nous préparons actuellement l'expédition de votre commande #${selectedOrder.orderNumber} sur TERRANOVA AGRO.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-bold border border-[#25D366]/30 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contacter le Client (WhatsApp)</span>
                </a>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `📦 *ORDRE DE LIVRAISON TERRANOVA AGRO*\n` +
                    `--------------------------------\n` +
                    `*N° Commande :* #${selectedOrder.orderNumber}\n` +
                    `*Client :* ${selectedOrder.customerName}\n` +
                    `*Téléphone :* ${selectedOrder.customerPhone}\n` +
                    `*Lieu de livraison :* ${selectedOrder.shippingAddress} (${selectedOrder.shippingCity})\n` +
                    (selectedOrder.customerNotes ? `*Note :* ${selectedOrder.customerNotes}\n` : "") +
                    `--------------------------------\n` +
                    `*Articles :*\n` +
                    selectedOrder.items.map(it => `- ${it.productName} (x${it.quantity} ${it.unit})`).join("\n") +
                    `\n--------------------------------\n` +
                    `*Total :* ${formatPrice(selectedOrder.totalAmount)}\n` +
                    `*Statut :* ${selectedOrder.status === "PAID" ? "✅ DÉJÀ ENCAISSÉ" : "⚠️ À ENCAISSER AU CLIENT"}\n`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 text-xs font-bold border border-terracotta-200 transition-colors"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Transmettre au Livreur</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <Link
                href={`/facture/${selectedOrder.orderNumber}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-clay-900 text-xs font-bold transition-colors"
              >
                <FileText className="w-4 h-4 text-terracotta-600" />
                <span>Afficher la Facture PDF</span>
              </Link>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-clay-900 text-sand-50 text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
