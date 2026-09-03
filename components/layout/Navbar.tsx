"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  ShieldCheck,
  ChevronDown,
  PhoneCall,
  Sprout,
} from "lucide-react";
import { useCart } from "../cart/CartContext";
import { PWAInstallPrompt } from "../ui/PWAInstallPrompt";

interface NavbarProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Navbar({ categories = [], currentUser = null }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-sand-50/90 backdrop-blur-md shadow-warm-sm border-b border-sand-200/80 py-3"
            : "bg-gradient-to-b from-clay-950/70 via-clay-950/40 to-transparent py-4 text-sand-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clay-900 via-clay-800 to-clay-700 border border-harvest-400/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 512 512">
                <path
                  d="M 256 380 L 256 140 M 170 160 L 342 160"
                  stroke="#E6AF2E"
                  strokeWidth="32"
                  strokeLinecap="round"
                />
                <circle cx="210" cy="220" r="24" fill="#E6AF2E" />
                <circle cx="302" cy="220" r="24" fill="#E6AF2E" />
                <circle cx="210" cy="280" r="24" fill="#E6AF2E" />
                <circle cx="302" cy="280" r="24" fill="#E6AF2E" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif text-lg font-bold tracking-[0.18em] transition-colors leading-tight ${
                  isScrolled ? "text-clay-900" : "text-sand-50 drop-shadow-sm"
                }`}
              >
                TERRANOVA
              </span>
              <span
                className={`text-[10px] font-sans font-semibold tracking-widest uppercase ${
                  isScrolled ? "text-terracotta-600" : "text-harvest-400"
                }`}
              >
                Agro-Industrie
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-terracotta-500 ${
                pathname === "/"
                  ? "text-terracotta-600 font-semibold"
                  : isScrolled
                  ? "text-clay-800"
                  : "text-sand-100"
              }`}
            >
              Accueil
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <Link
                href="/catalogue"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-terracotta-500 ${
                  pathname.startsWith("/catalogue")
                    ? "text-terracotta-600 font-semibold"
                    : isScrolled
                    ? "text-clay-800"
                    : "text-sand-100"
                }`}
              >
                <span>Catalogue & Filières</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </Link>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-sand-50 border border-sand-300 rounded-2xl shadow-warm-lg p-2 text-clay-900 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-sand-500 border-b border-sand-200">
                      Nos Familles de Produits
                    </div>
                    <div className="py-1">
                      <Link
                        href="/catalogue"
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-clay-900 hover:bg-sand-100 hover:text-terracotta-600 transition-colors"
                      >
                        🌾 Tout le catalogue
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/catalogue?category=${cat.slug}`}
                          className="block px-3 py-2 rounded-xl text-xs text-clay-700 hover:bg-sand-100 hover:text-terracotta-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#valeurs"
              className={`text-sm font-medium transition-colors hover:text-terracotta-500 ${
                isScrolled ? "text-clay-800" : "text-sand-100"
              }`}
            >
              Savoir-Faire
            </Link>

            <Link
              href="/#tracabilite"
              className={`text-sm font-medium transition-colors hover:text-terracotta-500 ${
                isScrolled ? "text-clay-800" : "text-sand-100"
              }`}
            >
              Traçabilité
            </Link>

            <Link
              href="/#temoignages"
              className={`text-sm font-medium transition-colors hover:text-terracotta-500 ${
                isScrolled ? "text-clay-800" : "text-sand-100"
              }`}
            >
              Témoignages
            </Link>
          </nav>

          {/* Action Icons (Search, Cart, PWA, Account) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Input / Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-sand-100 border border-sand-300 rounded-full px-3 py-1 text-clay-900"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher maïs, bétail..."
                    className="bg-transparent text-xs focus:outline-none w-36 sm:w-48 placeholder-sand-500"
                    autoFocus
                  />
                  <button type="submit" className="text-clay-700 hover:text-terracotta-600">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 text-sand-500 hover:text-clay-900 text-xs"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled
                      ? "text-clay-700 hover:bg-sand-200"
                      : "text-sand-100 hover:bg-clay-800/60"
                  }`}
                  title="Rechercher un produit"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* PWA Install Button */}
            <PWAInstallPrompt variant="button" />

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-all ${
                isScrolled
                  ? "bg-sand-200/80 hover:bg-terracotta-100 text-clay-900"
                  : "bg-clay-800/80 hover:bg-clay-700 text-sand-50 border border-clay-700"
              }`}
              title="Ouvrir le panier"
              id="cart-trigger-btn"
            >
              <ShoppingBag className="w-4 h-4 text-terracotta-500" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Admin CTA */}
            {currentUser ? (
              currentUser.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-clay-900 text-harvest-300 border border-harvest-400/40 hover:bg-clay-800 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-harvest-400" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  href="/compte"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sand-200 text-clay-900 hover:bg-sand-300 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-terracotta-600" />
                  <span className="hidden sm:inline">Mon Compte</span>
                </Link>
              )
            ) : (
              <Link
                href="/auth/login"
                className={`hidden sm:inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  isScrolled
                    ? "bg-clay-900 text-sand-50 hover:bg-clay-800"
                    : "bg-sand-50/90 text-clay-900 hover:bg-sand-50"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Connexion</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                isScrolled ? "text-clay-900 hover:bg-sand-200" : "text-sand-50 hover:bg-clay-800/80"
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-sand-50 border-b border-sand-300 px-4 pt-3 pb-6 text-clay-900 shadow-warm-lg">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium text-sm py-2 border-b border-sand-200 text-clay-900"
              >
                Accueil
              </Link>
              <Link
                href="/catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-sm py-2 border-b border-sand-200 text-terracotta-600 flex items-center justify-between"
              >
                <span>Catalogue Complet</span>
                <span className="text-xs bg-terracotta-100 text-terracotta-700 px-2 py-0.5 rounded-full">
                  {categories.length} Familles
                </span>
              </Link>
              <div className="pl-3 flex flex-col space-y-2 border-b border-sand-200 pb-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalogue?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-clay-700 py-1 hover:text-terracotta-600"
                  >
                    • {cat.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/#valeurs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1.5 text-clay-800"
              >
                Savoir-Faire & Rigueur
              </Link>
              <Link
                href="/#tracabilite"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1.5 text-clay-800"
              >
                Traçabilité & Qualité
              </Link>
              <Link
                href="/#temoignages"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1.5 text-clay-800"
              >
                Témoignages Partenaires
              </Link>

              <div className="pt-3 flex flex-col gap-2">
                {currentUser ? (
                  <Link
                    href={currentUser.role === "ADMIN" ? "/admin" : "/compte"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-clay-900 text-sand-50 font-semibold text-sm"
                  >
                    {currentUser.role === "ADMIN" ? "Espace Administration" : "Espace Client"}
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold text-sm shadow-warm-sm"
                  >
                    Connexion / Inscription Client
                  </Link>
                )}
                <a
                  href="https://wa.me/237690000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 rounded-xl bg-[#25D366]/15 text-[#128C7E] font-semibold text-xs flex items-center justify-center gap-2 border border-[#25D366]/30"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Service Commercial WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
