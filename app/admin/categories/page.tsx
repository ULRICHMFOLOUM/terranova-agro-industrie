import React from "react";
import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "./CategoriesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des Catégories | Admin TERRANOVA",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-clay-900">
            Gestion des Familles & Catégories
          </h1>
          <p className="text-xs text-sand-600">
            Créez et organisez vos filières de production sans limite. Elles apparaissent instantanément sur le site public.
          </p>
        </div>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
