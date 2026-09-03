import React from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DynamicSectionRenderer } from "@/components/sections/DynamicSectionRenderer";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSession();

  // Fetch all active categories ordered by sort order
  const categories = await prisma.category.findMany({
    where: { active: true },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { order: "asc" },
  });

  // Fetch all visible CMS sections ordered by sort order
  const sections = await prisma.section.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });

  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: {
      status: { not: "ARCHIVED" },
      featured: true,
    },
    include: {
      category: true,
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col selection:bg-terracotta-500 selection:text-white">
      {/* Sticky Glass Navbar */}
      <Navbar categories={categories} currentUser={user} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Main Showcase & Dynamic Sections */}
      <main className="flex-1 w-full">
        <DynamicSectionRenderer sections={sections} categories={categories} />

        {/* Featured Products Showcase */}
        {featuredProducts.length > 0 && (
          <FeaturedProductsSection products={featuredProducts} />
        )}
      </main>

      {/* Premium Agro-Industrial Footer */}
      <Footer />
    </div>
  );
}
