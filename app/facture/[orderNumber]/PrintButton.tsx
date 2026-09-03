"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clay-900 hover:bg-clay-800 text-sand-50 text-xs font-bold shadow-md transition-all active:scale-95"
      id="print-invoice-btn"
    >
      <Printer className="w-4 h-4 text-harvest-400" />
      <span>Imprimer / Télécharger en PDF</span>
    </button>
  );
}
