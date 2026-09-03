import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  LayoutDashboard,
  Layers,
  Package,
  Sliders,
  ShoppingBag,
  Settings,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { AdminNavLinks } from "./AdminNavLinks";
import { LogoutButton } from "../compte/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration | TERRANOVA AGRO-INDUSTRIE",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  // Contrôle d'accès strict au rôle ADMIN
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?error=admin_required");
  }

  return (
    <div className="min-h-screen bg-sand-100/60 text-clay-900 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-clay-950 text-sand-50 border-r border-clay-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3 border-b border-clay-800 pb-5">
            <div className="w-10 h-10 rounded-xl bg-clay-900 border border-harvest-400/40 flex items-center justify-center font-serif font-bold text-harvest-300 text-lg">
              T
            </div>
            <div>
              <span className="font-serif font-bold tracking-widest text-sm text-sand-50 uppercase block">
                TERRANOVA
              </span>
              <span className="text-[10px] tracking-wider text-harvest-400 font-mono flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-harvest-400" />
                <span>BACK-OFFICE ADMIN</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <AdminNavLinks />
        </div>

        {/* Footer info & Return to Store */}
        <div className="pt-6 border-t border-clay-800/80 space-y-3 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between p-2.5 rounded-xl bg-clay-900 hover:bg-clay-800 text-sand-300 hover:text-sand-50 text-xs font-medium border border-clay-800 transition-colors"
          >
            <span>Voir le site public</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between text-[11px] text-sand-400 px-1 pt-1">
            <span className="truncate">{user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Admin Top Header */}
        <header className="bg-white border-b border-sand-300 px-6 py-4 flex items-center justify-between shadow-warm-sm">
          <div>
            <span className="text-xs font-medium text-sand-500">Panneau de Contrôle</span>
            <h2 className="font-serif text-lg font-bold text-clay-900">
              Gestion de la Plateforme Agro-Industrielle
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-sage-100 text-sage-800 font-bold px-3 py-1 rounded-full border border-sage-300">
              ● Système Opérationnel
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
