"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Save,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductImageManager } from "@/components/admin/ProductImageManager";

interface ProductWithCat {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  unit: string;
  stock: number;
  sku?: string | null;
  status: string;
  featured: boolean;
  images: string;
  specs?: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

export function ProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: ProductWithCat[];
  categories: Array<{ id: string; name: string }>;
}) {
  const [products, setProducts] = useState<ProductWithCat[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("ALL");

  // Inline edit state tracking (e.g. { productId: { price, stock, saving, saved } })
  const [quickEdits, setQuickEdits] = useState<Record<string, { price: number; stock: number; saved?: boolean }>>({});

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCat | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "");
  const [formPrice, setFormPrice] = useState(10000);
  const [formUnit, setFormUnit] = useState("kg");
  const [formStock, setFormStock] = useState(50);
  const [formSku, setFormSku] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSpecsStr, setFormSpecsStr] = useState("");

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCatFilter === "ALL" || p.categoryId === selectedCatFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategoryId(categories[0]?.id || "");
    setFormPrice(15000);
    setFormUnit("sac 50kg");
    setFormStock(100);
    setFormSku(`TRN-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormStatus("ACTIVE");
    setFormFeatured(false);
    setFormShortDesc("");
    setFormDesc("");
    setFormImages(["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800"]);
    setFormSpecsStr('{\n  "Origine": "Domaines du Noun",\n  "Pureté": "99%"\n}');
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductWithCat) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategoryId(p.categoryId);
    setFormPrice(p.price);
    setFormUnit(p.unit);
    setFormStock(p.stock);
    setFormSku(p.sku || "");
    setFormStatus(p.status);
    setFormFeatured(p.featured);
    setFormShortDesc(p.shortDesc || "");
    setFormDesc(p.description);

    let imgUrls: string[] = [];
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed)) {
        imgUrls = parsed;
      } else if (p.images) {
        imgUrls = [p.images];
      }
    } catch {
      if (p.images) imgUrls = [p.images];
    }
    setFormImages(imgUrls);

    setFormSpecsStr(p.specs || '{\n  "Origine": "Domaines du Noun"\n}');
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    try {
      if (formImages.length === 0) {
        setModalError("Veuillez sélectionner au moins une photo pour ce produit.");
        setModalLoading(false);
        return;
      }

      const payload = {
        id: editingProduct?.id,
        name: formName,
        categoryId: formCategoryId,
        price: Number(formPrice),
        unit: formUnit,
        stock: Number(formStock),
        sku: formSku || null,
        status: formStatus,
        featured: formFeatured,
        shortDesc: formShortDesc || null,
        description: formDesc,
        images: JSON.stringify(formImages),
        specs: formSpecsStr.trim() || null,
      };

      const isEdit = !!editingProduct;
      const res = await fetch("/api/admin/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Erreur enregistrement");
        setModalLoading(false);
        return;
      }

      if (isEdit) {
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }

      setModalOpen(false);
      setModalLoading(false);
    } catch {
      setModalError("Erreur réseau");
      setModalLoading(false);
    }
  };

  // Quick inline stock & price update
  const handleQuickInlineSave = async (id: string) => {
    const edit = quickEdits[id];
    if (!edit) return;

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          price: edit.price,
          stock: edit.stock,
          status: edit.stock <= 0 ? "OUT_OF_STOCK" : "ACTIVE",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
        setQuickEdits((prev) => ({
          ...prev,
          [id]: { ...prev[id], saved: true },
        }));
        setTimeout(() => {
          setQuickEdits((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }, 1500);
      }
    } catch {
      alert("Erreur mise à jour rapide");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Confirmer la suppression définitive du produit "${name}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Erreur suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Add Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou référence SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-medium"
          >
            <option value="ALL">Toutes les filières</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 text-xs font-bold shadow-warm-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Produit</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-sand-300 shadow-warm-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-sand-100/70 border-b border-sand-200 text-sand-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Photo</th>
                <th className="py-3.5 px-4">Produit & Réf.</th>
                <th className="py-3.5 px-4">Filière</th>
                <th className="py-3.5 px-4">Prix Unitaire (FCFA)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredProducts.map((p) => {
                let firstImg = "";
                try {
                  const parsed = JSON.parse(p.images);
                  firstImg = parsed[0];
                } catch {
                  firstImg = p.images;
                }

                const currentEdit = quickEdits[p.id];
                const currentPrice = currentEdit ? currentEdit.price : p.price;
                const currentStock = currentEdit ? currentEdit.stock : p.stock;
                const isModified =
                  currentEdit && (currentEdit.price !== p.price || currentEdit.stock !== p.stock);

                return (
                  <tr key={p.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand-200 border border-sand-300">
                        <Image
                          src={firstImg || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=200"}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-clay-900 line-clamp-1">{p.name}</span>
                        {p.featured && (
                          <span className="text-harvest-500 font-bold text-[10px]" title="Mis en avant">
                            ★
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-sand-500">{p.sku || "Sans réf."}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-sand-100 text-clay-800 font-medium px-2.5 py-0.5 rounded-full text-[11px] border border-sand-200">
                        {p.category.name}
                      </span>
                    </td>

                    {/* Inline Price edit */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) =>
                            setQuickEdits((prev) => ({
                              ...prev,
                              [p.id]: {
                                price: Number(e.target.value),
                                stock: currentStock,
                              },
                            }))
                          }
                          className="w-24 px-2 py-1 rounded-lg bg-sand-50 border border-sand-300 font-mono font-bold text-terracotta-700 text-xs focus:outline-none focus:border-terracotta-500"
                        />
                        <span className="text-[10px] text-sand-500 font-mono">/{p.unit}</span>
                      </div>
                    </td>

                    {/* Inline Stock edit */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={currentStock}
                        onChange={(e) =>
                          setQuickEdits((prev) => ({
                            ...prev,
                            [p.id]: {
                              price: currentPrice,
                              stock: Number(e.target.value),
                            },
                          }))
                        }
                        className={`w-18 px-2 py-1 rounded-lg border font-mono font-bold text-xs focus:outline-none ${
                          currentStock <= 0
                            ? "bg-red-50 border-red-300 text-red-700"
                            : "bg-sand-50 border-sand-300 text-clay-900 focus:border-terracotta-500"
                        }`}
                      />
                    </td>

                    <td className="py-3 px-4">
                      {currentStock <= 0 || p.status === "OUT_OF_STOCK" ? (
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          Rupture
                        </span>
                      ) : (
                        <span className="bg-sage-100 text-sage-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          En vente
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isModified && (
                          <button
                            onClick={() => handleQuickInlineSave(p.id)}
                            className="p-1.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white shadow-sm transition-colors"
                            title="Sauvegarder les modifications rapides"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {currentEdit?.saved && (
                          <span className="text-sage-600 text-[10px] font-bold">✓ Sauvegardé</span>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-clay-700 hover:bg-sand-200 hover:text-terracotta-600 transition-colors"
                          title="Fiche complète"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-sand-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-clay-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-300 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-clay-900">
                {editingProduct ? "Modifier la Fiche Produit" : "Ajouter un Nouveau Produit"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-sand-400 hover:text-clay-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProductModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Maïs Jaune Grade A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Catégorie / Filière *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Prix Unitaire (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Unité de vente</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="Ex: kg, sac 50kg, tête, litre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Stock disponible</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Référence SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="Ex: CER-MAIS-50KG"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded text-terracotta-600 focus:ring-terracotta-500"
                    />
                    <span className="font-semibold text-clay-800">★ Produit Phare</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">Résumé court</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Phrase d'accroche pour les cartes catalogue"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">Description agronomique complète</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Détails du cycle cultural, alimentation des bêtes, conditionnement..."
                  className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              {/* Product Image Manager */}
              <div className="pt-2 border-t border-sand-200">
                <ProductImageManager
                  images={formImages}
                  onChange={setFormImages}
                  maxImages={8}
                />
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">
                  Spécifications Techniques (Format JSON)
                </label>
                <textarea
                  rows={3}
                  value={formSpecsStr}
                  onChange={(e) => setFormSpecsStr(e.target.value)}
                  placeholder='{ "Humidité": "12.5%", "Pureté": "99.2%" }'
                  className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-clay-800 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {modalLoading ? "Enregistrement..." : "Sauvegarder le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
