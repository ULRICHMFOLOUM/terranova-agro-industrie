"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Sliders,
} from "lucide-react";

interface SectionItem {
  id: string;
  type: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  badge?: string | null;
  mediaUrl?: string | null;
  secondaryMediaUrl?: string | null;
  metadata?: string | null;
  order: number;
  visible: boolean;
}

const SECTION_TYPES = [
  { value: "HERO", label: "Hero 3D & Accroche Principale" },
  { value: "CATEGORIES_HIGHLIGHT", label: "Familles & Filières de Produits" },
  { value: "STORY_VALUES", label: "Savoir-Faire & Rigueur Industrielle" },
  { value: "KEY_METRICS", label: "Chiffres Clés & Indicateurs d'Échelle" },
  { value: "QUALITY_TRACEABILITY", label: "Traçabilité & Qualité Sanitaire" },
  { value: "TESTIMONIALS", label: "Témoignages & Preuve Sociale" },
  { value: "GALLERY", label: "Galerie Photographique des Domaines" },
  { value: "CTA_BANNER", label: "Appel à l'Action & Conversion Finale" },
];

export function SectionsClient({
  initialSections,
}: {
  initialSections: SectionItem[];
}) {
  const [sections, setSections] = useState<SectionItem[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);

  const [formType, setFormType] = useState("STORY_VALUES");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState("");
  const [formSecondaryMediaUrl, setFormSecondaryMediaUrl] = useState("");
  const [formMetadata, setFormMetadata] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [formVisible, setFormVisible] = useState(true);

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleOpenAddModal = () => {
    setEditingSection(null);
    setFormType("STORY_VALUES");
    setFormTitle("");
    setFormSubtitle("");
    setFormBadge("Nouvelle Section");
    setFormContent("");
    setFormMediaUrl("https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=1200");
    setFormSecondaryMediaUrl("");
    setFormMetadata("{}");
    setFormOrder(sections.length + 1);
    setFormVisible(true);
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (sec: SectionItem) => {
    setEditingSection(sec);
    setFormType(sec.type);
    setFormTitle(sec.title);
    setFormSubtitle(sec.subtitle || "");
    setFormBadge(sec.badge || "");
    setFormContent(sec.content || "");
    setFormMediaUrl(sec.mediaUrl || "");
    setFormSecondaryMediaUrl(sec.secondaryMediaUrl || "");
    setFormMetadata(sec.metadata || "{}");
    setFormOrder(sec.order);
    setFormVisible(sec.visible);
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    try {
      const isEdit = !!editingSection;
      const payload = {
        id: editingSection?.id,
        type: formType,
        title: formTitle,
        subtitle: formSubtitle || null,
        badge: formBadge || null,
        content: formContent || null,
        mediaUrl: formMediaUrl || null,
        secondaryMediaUrl: formSecondaryMediaUrl || null,
        metadata: formMetadata || null,
        order: Number(formOrder),
        visible: formVisible,
      };

      const res = await fetch("/api/admin/sections", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Erreur enregistrement section");
        setModalLoading(false);
        return;
      }

      if (isEdit) {
        setSections((prev) =>
          prev
            .map((s) => (s.id === editingSection.id ? data.section : s))
            .sort((a, b) => a.order - b.order)
        );
      } else {
        setSections((prev) => [...prev, data.section].sort((a, b) => a.order - b.order));
      }

      setModalOpen(false);
      setModalLoading(false);
    } catch {
      setModalError("Erreur réseau");
      setModalLoading(false);
    }
  };

  // Toggle Visibility
  const handleToggleVisible = async (sec: SectionItem) => {
    const updatedVisible = !sec.visible;
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sec.id, visible: updatedVisible }),
      });
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === sec.id ? { ...s, visible: updatedVisible } : s))
        );
      }
    } catch {
      alert("Erreur changement de visibilité");
    }
  };

  // Move Reorder (Up / Down)
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const currentSec = sections[index];
    const targetSec = sections[targetIndex];

    const newCurrentOrder = targetSec.order;
    const newTargetOrder = currentSec.order;

    try {
      await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentSec.id, order: newCurrentOrder }),
      });

      await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: targetSec.id, order: newTargetOrder }),
      });

      const updated = [...sections];
      updated[index] = { ...currentSec, order: newCurrentOrder };
      updated[targetIndex] = { ...targetSec, order: newTargetOrder };
      setSections(updated.sort((a, b) => a.order - b.order));
    } catch {
      alert("Erreur de réorganisation");
    }
  };

  const handleDeleteSection = async (id: string, title: string) => {
    if (!confirm(`Supprimer définitivement la section "${title}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSections((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Erreur suppression");
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
          <span>Ajouter une Section</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-sm ${
              sec.visible ? "border-sand-300" : "border-sand-200 opacity-60 bg-sand-50"
            }`}
          >
            {/* Left Info */}
            <div className="flex items-center gap-4">
              {/* Order Steppers */}
              <div className="flex flex-col items-center justify-center gap-1 bg-sand-100 p-1.5 rounded-xl border border-sand-200">
                <button
                  onClick={() => handleMoveOrder(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded text-clay-700 hover:bg-sand-200 disabled:opacity-30"
                  title="Monter"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-xs text-clay-900">{sec.order}</span>
                <button
                  onClick={() => handleMoveOrder(idx, "down")}
                  disabled={idx === sections.length - 1}
                  className="p-1 rounded text-clay-700 hover:bg-sand-200 disabled:opacity-30"
                  title="Descendre"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-clay-900 text-harvest-300 px-2 py-0.5 rounded-md uppercase">
                    {sec.type}
                  </span>
                  {sec.badge && (
                    <span className="text-[10px] font-semibold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-md">
                      {sec.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-base text-clay-900 mt-1">{sec.title}</h3>
                {sec.subtitle && (
                  <p className="text-xs text-sand-600 line-clamp-1">{sec.subtitle}</p>
                )}
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleToggleVisible(sec)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  sec.visible
                    ? "bg-sage-100 text-sage-800 hover:bg-sage-200"
                    : "bg-sand-200 text-sand-600 hover:bg-sand-300"
                }`}
                title={sec.visible ? "Masquer la section" : "Afficher la section"}
              >
                {sec.visible ? <Eye className="w-4 h-4 text-sage-600" /> : <EyeOff className="w-4 h-4 text-sand-500" />}
                <span className="hidden sm:inline">{sec.visible ? "Visible" : "Masquée"}</span>
              </button>

              <button
                onClick={() => handleOpenEditModal(sec)}
                className="p-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-clay-800 transition-colors"
                title="Modifier le contenu"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteSection(sec.id, sec.title)}
                className="p-2 rounded-xl bg-sand-100 hover:bg-red-50 text-sand-500 hover:text-red-600 transition-colors"
                title="Supprimer la section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-clay-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-300 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-clay-900">
                {editingSection ? "Modifier la Section CMS" : "Ajouter une Nouvelle Section"}
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

            <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Type de section *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-medium"
                  >
                    {SECTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Badge d&apos;accroche</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Ex: Domaines & Usines Certifiés"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">Titre principal *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Grand titre éditorial de la section"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">Sous-titre / Accroche</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Phrase explicative sous le titre"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">Corps de texte</label>
                <textarea
                  rows={3}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Paragraphe descriptif ou explicatif..."
                  className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">URL Photo Principale</label>
                  <input
                    type="url"
                    value={formMediaUrl}
                    onChange={(e) => setFormMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-clay-800 mb-1">URL Photo Secondaire</label>
                  <input
                    type="url"
                    value={formSecondaryMediaUrl}
                    onChange={(e) => setFormSecondaryMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-clay-800 mb-1">
                  Données Structurées JSON (Points clés, métriques, boutons)
                </label>
                <textarea
                  rows={3}
                  value={formMetadata}
                  onChange={(e) => setFormMetadata(e.target.value)}
                  placeholder='{ "points": [...] }'
                  className="w-full px-3.5 py-2 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-clay-800 mb-1">Ordre de tri</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVisible}
                      onChange={(e) => setFormVisible(e.target.checked)}
                      className="rounded text-terracotta-600 focus:ring-terracotta-500"
                    />
                    <span className="font-semibold text-clay-800">Section Publiquement Visible</span>
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
                  disabled={modalLoading}
                  className="px-5 py-2.5 rounded-xl bg-clay-900 hover:bg-terracotta-600 text-sand-50 font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {modalLoading ? "Enregistrement..." : "Sauvegarder la section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
