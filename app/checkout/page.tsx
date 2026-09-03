import React from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Validation de Commande | TERRANOVA AGRO-INDUSTRIE",
};

export default async function CheckoutPage() {
  const user = await getSession();

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col">
      <Navbar categories={categories} currentUser={user} />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <CheckoutClient currentUser={user} />
      </main>

      <Footer />
    </div>
  );
}
