import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoiceTemplate } from "@/components/invoice/InvoiceTemplate";
import { PrintButton } from "./PrintButton";
import { ArrowLeft, Download, Printer } from "lucide-react";

export const dynamic = "force-dynamic";

interface InvoicePageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const { orderNumber } = await params;
  return {
    title: `Facture #${orderNumber} | TERRANOVA AGRO-INDUSTRIE`,
  };
}

export default async function InvoiceViewPage({ params }: InvoicePageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-sand-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {/* Top Action Bar (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-clay-800 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la boutique</span>
        </Link>

        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
      </div>

      {/* Invoice Document */}
      <InvoiceTemplate
        data={{
          orderNumber: order.orderNumber,
          invoiceNumber: order.invoiceNumber || `FACT-${order.orderNumber}`,
          createdAt: order.createdAt,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          shippingCity: order.shippingCity,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          paymentRef: order.paymentRef,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount,
          shippingFee: order.shippingFee,
          totalAmount: order.totalAmount,
          items: order.items,
        }}
      />
    </div>
  );
}
