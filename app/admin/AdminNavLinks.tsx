"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Sliders,
  ShoppingBag,
  Settings,
} from "lucide-react";

export function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Tableau de Bord", icon: LayoutDashboard, exact: true },
    { href: "/admin/categories", label: "Catégories & Filières", icon: Layers },
    { href: "/admin/produits", label: "Catalogue & Stocks", icon: Package },
    { href: "/admin/sections", label: "Sections Dynamiques", icon: Sliders },
    { href: "/admin/commandes", label: "Commandes & Ventes", icon: ShoppingBag },
    { href: "/admin/parametres", label: "Paramètres du Site", icon: Settings },
  ];

  return (
    <nav className="space-y-1.5">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? "bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-warm-sm"
                : "text-sand-300 hover:bg-clay-900 hover:text-sand-50"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-harvest-400"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
