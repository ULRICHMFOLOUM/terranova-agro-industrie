import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductsClient } from "./ProductsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des Produits & Stocks | Admin TERRANOVA",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-clay-900">
          Gestion du Catalogue & des Stocks
        </h1>
        <p className="text-xs text-sand-600">
          Ajoutez de nouveaux lots, ajustez les prix et stocks en direct avec sauvegarde instantanée.
        </p>
      </div>

      <ProductsClient initialProducts={products} categories={categories} />
    </div>
  );
}
