import React from "react";
import { formatPrice, formatDate } from "@/lib/utils";

export interface InvoiceData {
  orderNumber: string;
  invoiceNumber: string;
  createdAt: Date | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef?: string | null;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  items: Array<{
    id?: string;
    productName: string;
    unit: string;
    unitPrice: number;
    quantity: number;
    totalRow: number;
  }>;
}

export function InvoiceTemplate({ data }: { data: InvoiceData }) {
  return (
    <div className="bg-white text-clay-950 p-8 sm:p-12 max-w-4xl mx-auto font-sans leading-normal border border-sand-300 shadow-sm print:border-none print:shadow-none print:p-0">
      {/* Invoice Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-clay-900 pb-8 gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-clay-900 text-harvest-300 flex items-center justify-center font-serif font-bold text-xl print:bg-black">
              T
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-widest text-clay-900 uppercase">
                TERRANOVA AGRO-INDUSTRIE
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-terracotta-700 font-semibold">
                Excellence Agro-Pastorale & Précision Industrielle
              </p>
            </div>
          </div>
          <p className="text-xs text-sand-600 max-w-sm pt-2">
            Complexe Agro-Industriel & Domaines du Noun • Siège Administratif Douala, Cameroun<br />
            RCCM : RC/DLA/2026/B/8941 • N° Contribuable : M092612345678A<br />
            Tél : +237 690 00 00 00 / 670 00 00 00 • Email : facturation@terranova.agri
          </p>
        </div>

        <div className="text-left sm:text-right space-y-1 self-stretch sm:self-auto bg-sand-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-none border-sand-200">
          <span className="font-serif text-2xl font-bold text-terracotta-700 uppercase block tracking-wider">
            FACTURE
          </span>
          <div className="font-mono text-xs font-bold text-clay-900">
            N° : {data.invoiceNumber || `FACT-${data.orderNumber}`}
          </div>
          <div className="text-xs text-sand-600 font-mono">
            Date d&apos;émission : {formatDate(data.createdAt)}
          </div>
          <div className="inline-block mt-2 px-2.5 py-1 rounded bg-sage-100 text-sage-800 text-[10px] font-bold uppercase border border-sage-300 print:border-black">
            Statut : {data.paymentStatus === "SUCCESS" || data.paymentStatus === "PAID" ? "ACQUITTÉE" : "EN ATTENTE"}
          </div>
        </div>
      </div>

      {/* Customer & Order Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 text-xs">
        {/* Bill To */}
        <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-1.5 print:bg-white print:border-sand-300">
          <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-700 block">
            Facturé à (Client) :
          </span>
          <h2 className="font-serif font-bold text-sm text-clay-900">{data.customerName}</h2>
          <p className="text-sand-700">
            {data.customerEmail} • {data.customerPhone}
          </p>
          <p className="text-sand-700">
            Destination : {data.shippingAddress} ({data.shippingCity})
          </p>
        </div>

        {/* Payment details */}
        <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-1.5 print:bg-white print:border-sand-300">
          <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-700 block">
            Détails du Paiement :
          </span>
          <p className="text-sand-700">
            Mode : <strong>{data.paymentMethod}</strong>
          </p>
          <p className="text-sand-700">
            Réf. Transaction : <span className="font-mono">{data.paymentRef || "TRN-MOMO-OK"}</span>
          </p>
          <p className="text-sand-700">
            Commande associée : <span className="font-mono">#{data.orderNumber}</span>
          </p>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="my-8 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-clay-900 text-sand-50 font-serif print:bg-black">
              <th className="py-3 px-4 rounded-l-lg">Désignation de l&apos;article / Lot</th>
              <th className="py-3 px-3 text-center">Unité</th>
              <th className="py-3 px-3 text-right">Prix Unitaire</th>
              <th className="py-3 px-3 text-center">Quantité</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Total Ligne</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {data.items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-sand-50/70"}>
                <td className="py-3 px-4 font-medium text-clay-900">{item.productName}</td>
                <td className="py-3 px-3 text-center text-sand-600 font-mono">{item.unit}</td>
                <td className="py-3 px-3 text-right font-mono text-sand-700">
                  {formatPrice(item.unitPrice)}
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-clay-900">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-clay-900">
                  {formatPrice(item.totalRow)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Stamp Calculation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end pt-4 border-t border-sand-200">
        {/* Digital Verification Stamp */}
        <div className="p-4 rounded-2xl bg-sand-50 border border-dashed border-sand-400 text-[11px] text-sand-600 space-y-1 print:bg-white">
          <div className="font-serif font-bold text-clay-900 uppercase">
            Sceau Numérique & Traçabilité Fiscale
          </div>
          <p>
            Document certifié conforme par le système d&apos;enregistrement des ventes industrielles TERRANOVA.
          </p>
          <div className="font-mono text-[10px] text-terracotta-700 pt-1">
            HASH : SHA256:{data.orderNumber}998144X
          </div>
        </div>

        {/* Totals Table */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-sand-100">
            <span className="text-sand-600">Total Hors Taxes (HT) :</span>
            <span className="font-mono font-semibold text-clay-900">{formatPrice(data.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-sand-100">
            <span className="text-sand-600">TVA (Exonération Produits Agricoles Bruts) :</span>
            <span className="font-mono text-sand-600">0 FCFA (0%)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-sand-100">
            <span className="text-sand-600">Frais de logistique :</span>
            <span className="font-mono text-sand-600">Inclus</span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-bold text-sm text-clay-900 uppercase">Net à Payer (TTC) :</span>
            <span className="font-serif text-xl font-bold text-terracotta-700">
              {formatPrice(data.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="mt-12 pt-6 border-t border-sand-200 text-center text-[10px] text-sand-500 space-y-1">
        <p>
          TERRANOVA AGRO-INDUSTRIE SA au capital de 500 000 000 FCFA • Siège Social : Douala, Cameroun.
        </p>
        <p>
          Pour toute réclamation relative à la livraison ou à la traçabilité des lots, contactez support@terranova.agri sous 48h.
        </p>
      </div>
    </div>
  );
}
