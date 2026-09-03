"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Layers, Check, X, AlertCircle, FolderOpen, Upload } from "lucide-react";
import { MediaGalleryModal } from "@/components/admin/MediaGalleryModal";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
  _count: {
    products: number;
  };
}

export function CategoriesClient({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[];
}) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800");
    setOrder(categories.length + 1);
    setActive(true);
    setError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setOrder(cat.order);
    setActive(cat.active);
    setError("");
    setModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEdit = !!editingCategory;
      const url = "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";
      const payload = {
        id: editingCategory?.id,
        name,
        description,
        image,
        order: Number(order),
        active,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'enregistrement");
        setLoading(false);
        return;
      }

      if (isEdit) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
        );
      } else {
        setCategories((prev) => [...prev, { ...data.category, _count: { products: 0 } }]);
      }

      setModalOpen(false);
      setLoading(false);
    } catch {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur suppression");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Erreur réseau");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 text-xs font-bold shadow-warm-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white rounded-3xl border border-sand-300 shadow-warm-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-sand-100/70 border-b border-sand-200 text-sand-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Ordre</th>
                <th className="py-3 px-4">Visuel</th>
                <th className="py-3 px-4">Nom de la Famille</th>
                <th className="py-3 px-4">Slug URL</th>
                <th className="py-3 px-4">Produits rattachés</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-clay-900">{cat.order}</td>
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-sand-200 border border-sand-300">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-serif font-bold text-clay-900 block">{cat.name}</span>
                    <span className="text-[11px] text-sand-500 line-clamp-1">{cat.description}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sand-600">{cat.slug}</td>
                  <td className="py-3 px-4">
                    <span className="bg-sand-100 text-clay-800 font-bold px-2.5 py-1 rounded-full text-[11px] border border-sand-200">
                      {cat._count?.products || 0} produit(s)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {cat.active ? (
                      <span className="text-sage-700 bg-sage-100 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Active
                      </span>
                    ) : (
                      <span className="text-sand-500 bg-sand-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Désactivée
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 rounded-lg text-clay-700 hover:bg-sand-200 hover:text-terracotta-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-sand-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-clay-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sand-300 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-clay-900">
                {editingCategory ? "Modifier la Catégorie" : "Créer une Nouvelle Catégorie"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-sand-400 hover:text-clay-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-clay-800 mb-1">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Céréales & Grains"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentation des spécificités agronomiques de cette famille..."
                  className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-clay-800">
                    Photo de couverture *
                  </label>
                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 font-semibold text-[11px] flex items-center gap-1 transition-colors border border-terracotta-200"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Choisir dans la Galerie / Appareil</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {image && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand-100 border border-sand-300 shrink-0">
                      <Image src={image} alt="Aperçu" fill className="object-cover" />
                    </div>
                  )}
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">
                    Ordre d&apos;affichage
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded text-terracotta-600 focus:ring-terracotta-500"
                    />
                    <span className="font-semibold text-clay-800">Catégorie Active</span>
                  </label>
                </div>
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
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : "Enregistrer la catégorie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Gallery Modal */}
      <MediaGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        multiple={false}
        onSelectImages={(urls) => {
          if (urls.length > 0) setImage(urls[0]);
        }}
        title="Choisir la Photo de la Catégorie"
      />
    </div>
  );
}
