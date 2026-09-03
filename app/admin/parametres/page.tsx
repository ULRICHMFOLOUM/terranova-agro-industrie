import React from "react";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Paramètres du Site | Admin TERRANOVA",
};

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-clay-900">
          Paramètres Généraux de la Firme
        </h1>
        <p className="text-xs text-sand-600">
          Configurez l&apos;identité publique de la firme, vos coordonnées de facturation et les clés de passerelle de paiement.
        </p>
      </div>

      <SettingsClient initialSettings={settingsMap} />
    </div>
  );
}
