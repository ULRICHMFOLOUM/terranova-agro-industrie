import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSession } from "@/lib/auth";
import { Search, SlidersHorizontal, Filter, Layers, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catalogue Produits & Filières | TERRANOVA AGRO-INDUSTRIE",
  description: "Explorez nos céréales de qualité, bétail sélectionné, produits laitiers, semences certifiées et équipements agricoles.",
};

interface CataloguePageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    stock?: string;
  }>;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const params = await searchParams;
  const selectedCategorySlug = params.category;
  const searchQuery = params.q || "";
  const sortOption = params.sort || "featured";
  const inStockOnly = params.stock === "1";

  const user = await getSession();

  // Fetch all active categories
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  // Build where filter for products
  const whereFilter: any = {
    status: { not: "ARCHIVED" },
  };

  if (selectedCategorySlug) {
    const matchedCategory = categories.find((c) => c.slug === selectedCategorySlug);
    if (matchedCategory) {
      whereFilter.categoryId = matchedCategory.id;
    }
  }

  if (searchQuery) {
    whereFilter.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { shortDesc: { contains: searchQuery } },
    ];
  }

  if (inStockOnly) {
    whereFilter.stock = { gt: 0 };
    whereFilter.status = "ACTIVE";
  }

  // Determine sorting order
  let orderByClause: any = [{ featured: "desc" }, { createdAt: "desc" }];
  if (sortOption === "price-asc") {
    orderByClause = { price: "asc" };
  } else if (sortOption === "price-desc") {
    orderByClause = { price: "desc" };
  } else if (sortOption === "newest") {
    orderByClause = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where: whereFilter,
    include: {
      category: true,
    },
    orderBy: orderByClause,
  });

  const currentCategory = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="min-h-screen bg-sand-50 text-clay-900 flex flex-col">
      <Navbar categories={categories} currentUser={user} />
      <CartDrawer />

      {/* Catalogue Hero Banner */}
      <section className="bg-clay-950 text-sand-50 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-clay-800/50 via-clay-950 to-clay-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono tracking-widest text-harvest-400 uppercase">
              Catalogue & Filières Agro-Industrielles
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-sand-50">
              {currentCategory ? currentCategory.name : "Tous Nos Produits d'Excellence"}
            </h1>
            <p className="text-sm sm:text-base text-sand-300 font-light leading-relaxed">
              {currentCategory
                ? currentCategory.description
                : "Découvrez notre gamme complète de céréales, bétail de race, produits laitiers, intrants certifiés et équipements professionnels."}
            </p>
          </div>

          {/* Search bar & Live Filter Form */}
          <div className="mt-8">
            <form method="GET" action="/catalogue" className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Rechercher par nom, variété, semence, bétail..."
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-clay-900/90 border border-clay-800 text-sand-50 placeholder-sand-400 text-xs focus:outline-none focus:border-harvest-400 transition-colors shadow-inner"
                />
                {selectedCategorySlug && (
                  <input type="hidden" name="category" value={selectedCategorySlug} />
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-semibold text-xs transition-all shadow-md shrink-0"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <Link
            href={`/catalogue${searchQuery ? `?q=${searchQuery}` : ""}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all border ${
              !selectedCategorySlug
                ? "bg-clay-900 text-harvest-300 border-clay-900 shadow-sm"
                : "bg-white text-clay-700 border-sand-300 hover:border-terracotta-400"
            }`}
          >
            🌾 Toutes les filières ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogue?category=${cat.slug}${searchQuery ? `&q=${searchQuery}` : ""}`}
              className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all border ${
                selectedCategorySlug === cat.slug
                  ? "bg-clay-900 text-harvest-300 border-clay-900 shadow-sm font-bold"
                  : "bg-white text-clay-700 border-sand-300 hover:border-terracotta-400"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Filters Summary & Sorting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-sand-200">
          <div className="text-xs text-sand-600">
            Affichage de <strong>{products.length}</strong> produit{products.length > 1 ? "s" : ""}
            {searchQuery && (
              <span>
                {" "}pour la recherche &laquo; <strong>{searchQuery}</strong> &raquo;
              </span>
            )}
            {selectedCategorySlug && (
              <span>
                {" "}dans <strong>{currentCategory?.name}</strong>
              </span>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-sand-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Trier par :</span>
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Link
                href={`/catalogue?${new URLSearchParams({
                  ...(selectedCategorySlug ? { category: selectedCategorySlug } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                  sort: "featured",
                }).toString()}`}
                className={`px-2.5 py-1 rounded-lg ${
                  sortOption === "featured"
                    ? "bg-sand-200 font-bold text-clay-900"
                    : "text-sand-600 hover:text-clay-900"
                }`}
              >
                Pertinence
              </Link>
              <Link
                href={`/catalogue?${new URLSearchParams({
                  ...(selectedCategorySlug ? { category: selectedCategorySlug } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                  sort: "price-asc",
                }).toString()}`}
                className={`px-2.5 py-1 rounded-lg ${
                  sortOption === "price-asc"
                    ? "bg-sand-200 font-bold text-clay-900"
                    : "text-sand-600 hover:text-clay-900"
                }`}
              >
                Prix croissant
              </Link>
              <Link
                href={`/catalogue?${new URLSearchParams({
                  ...(selectedCategorySlug ? { category: selectedCategorySlug } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                  sort: "price-desc",
                }).toString()}`}
                className={`px-2.5 py-1 rounded-lg ${
                  sortOption === "price-desc"
                    ? "bg-sand-200 font-bold text-clay-900"
                    : "text-sand-600 hover:text-clay-900"
                }`}
              >
                Prix décroissant
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center text-sand-500 mx-auto">
              <Search className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="font-serif font-bold text-xl text-clay-900">
              Aucun produit ne correspond à vos critères
            </h3>
            <p className="text-xs text-sand-600 leading-relaxed">
              Essayez de modifier vos termes de recherche ou sélectionnez une autre famille de produits.
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-clay-900 text-sand-50 text-xs font-semibold hover:bg-clay-800 transition-colors"
            >
              Réinitialiser les filtres
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                shortDesc={p.shortDesc}
                price={p.price}
                unit={p.unit}
                stock={p.stock}
                status={p.status}
                featured={p.featured}
                images={p.images}
                categoryName={p.category.name}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
