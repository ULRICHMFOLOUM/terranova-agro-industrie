import React from "react";
import { prisma } from "@/lib/prisma";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des Commandes & Ventes | Admin TERRANOVA",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-clay-900">
          Suivi des Commandes & Factures
        </h1>
        <p className="text-xs text-sand-600">
          Supervisez les encaissements, mettez à jour les statuts de livraison et accédez aux factures PDF générées.
        </p>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}
