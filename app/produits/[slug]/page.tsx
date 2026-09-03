import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailClient } from "./ProductDetailClient";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileText,
  PhoneCall,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) return { title: "Produit non trouvé" };

  return {
    title: `${product.name} | TERRANOVA AGRO-INDUSTRIE`,
    description: product.shortDesc || product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const user = await getSession();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch categories for navbar
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: { not: "ARCHIVED" },
    },
    take: 4,
    include: {
      category: true,
    },
  });

  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(product.images);
  } catch {
    parsedImages = [product.images];
  }

  let parsedSpecs: Record<string, string> = {};
  if (product.specs) {
    try {
      parsedSpecs = JSON.parse(product.specs);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col">
      <Navbar categories={categories} currentUser={user} />
      <CartDrawer />

      {/* Main Product Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-sand-500 mb-8 overflow-x-auto pb-2">
          <Link href="/" className="hover:text-terracotta-600 transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/catalogue" className="hover:text-terracotta-600 transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/catalogue?category=${product.category.slug}`}
            className="hover:text-terracotta-600 transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-clay-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Grid (Gallery & Purchase Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Client Interactive Gallery & Specs */}
          <div className="lg:col-span-7">
            <ProductDetailClient
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                unit: product.unit,
                stock: product.stock,
                status: product.status,
                images: parsedImages,
                shortDesc: product.shortDesc,
                description: product.description,
                specs: parsedSpecs,
                categoryName: product.category.name,
              }}
            />
          </div>

          {/* Right Column: Reassurance & Purchasing Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-sand-300 shadow-warm-md space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-700 bg-terracotta-50 px-3 py-1.5 rounded-full w-fit">
                <span>Filière {product.category.name}</span>
              </div>

              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-clay-900 leading-tight">
                  {product.name}
                </h1>
                {product.sku && (
                  <span className="text-[11px] font-mono text-sand-500 mt-1 block">
                    Réf. SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
                <span className="text-xs text-sand-600 block">Prix unitaire HT</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-terracotta-700">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-sans text-sand-600">/ {product.unit}</span>
                </div>
              </div>

              {/* Description preview */}
              <p className="text-xs sm:text-sm text-sand-700 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Reassurance list */}
              <div className="space-y-3 pt-4 border-t border-sand-200 text-xs text-clay-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-sage-600" />
                  </div>
                  <div>
                    <span className="font-semibold block">Garantie Traçabilité & Qualité</span>
                    <span className="text-[11px] text-sand-600">Contrôle agronomique et laboratoire certifié</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-terracotta-600" />
                  </div>
                  <div>
                    <span className="font-semibold block">Expédition & Logistique Adaptée</span>
                    <span className="text-[11px] text-sand-600">Camions bâchés et transport sécurisé pour bétail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        {Object.keys(parsedSpecs).length > 0 && (
          <div className="mt-16 p-8 rounded-3xl bg-white border border-sand-300 shadow-warm-sm">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-terracotta-600" />
              <h3 className="font-serif text-xl font-bold text-clay-900">
                Caractéristiques Techniques & Fiche Agronomique
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(parsedSpecs).map(([key, val], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-xs"
                >
                  <span className="font-medium text-sand-600">{key}</span>
                  <span className="font-semibold font-mono text-clay-900 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-clay-900">
                Produits Similaires dans cette Filière
              </h3>
              <Link
                href={`/catalogue?category=${product.category.slug}`}
                className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
              >
                Voir toute la filière &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  id={rp.id}
                  name={rp.name}
                  slug={rp.slug}
                  shortDesc={rp.shortDesc}
                  price={rp.price}
                  unit={rp.unit}
                  stock={rp.stock}
                  status={rp.status}
                  featured={rp.featured}
                  images={rp.images}
                  categoryName={rp.category.name}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
