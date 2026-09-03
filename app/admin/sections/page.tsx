import React from "react";
import { prisma } from "@/lib/prisma";
import { SectionsClient } from "./SectionsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des Sections Dynamiques | Admin TERRANOVA",
};

export default async function AdminSectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-clay-900">
          Gestionnaire de Sections CMS Dynamiques
        </h1>
        <p className="text-xs text-sand-600">
          Réordonnez vos sections de page d&apos;accueil, modifiez les textes, photos et boutons d&apos;action sans intervention technique.
        </p>
      </div>

      <SectionsClient initialSections={sections} />
    </div>
  );
}
