"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Search,
  Check,
  Image as ImageIcon,
  FolderOpen,
  Sparkles,
  Link2,
  RefreshCw,
  AlertCircle,
  Plus,
} from "lucide-react";

export interface MediaItem {
  url: string;
  title: string;
  category: string;
  source: "upload" | "database" | "preset";
  createdAt?: string;
}

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (urls: string[]) => void;
  multiple?: boolean;
  title?: string;
}

export function MediaGalleryModal({
  isOpen,
  onClose,
  onSelectImages,
  multiple = true,
  title = "Médiathèque & Galerie Photos",
}: MediaGalleryModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "upload" | "database" | "preset">("ALL");

  // Upload Tab state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL Tab state
  const [customUrl, setCustomUrl] = useState("");
  const [customUrlPreview, setCustomUrlPreview] = useState("");

  // Load media on mount / open
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrls([]);
      setError("");
      setUploadError("");
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok && data.media?.all) {
        setMediaList(data.media.all);
      } else {
        setError(data.error || "Impossible de charger la médiathèque.");
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Toggle selection
  const handleToggleSelect = (url: string) => {
    if (multiple) {
      setSelectedUrls((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      );
    } else {
      setSelectedUrls([url]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedUrls.length > 0) {
      onSelectImages(selectedUrls);
      onClose();
    }
  };

  // Upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Erreur lors du téléversement.");
        setUploading(false);
        return;
      }

      if (data.urls && data.urls.length > 0) {
        // Auto-select uploaded urls
        if (multiple) {
          setSelectedUrls((prev) => [...prev, ...data.urls]);
        } else {
          setSelectedUrls([data.urls[0]]);
        }
        // Refresh media library and switch to library view
        await fetchMedia();
        setActiveTab("library");
      }
    } catch {
      setUploadError("Erreur réseau lors du téléversement.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    const trimmed = customUrl.trim();
    if (multiple) {
      setSelectedUrls((prev) => [...prev, trimmed]);
    } else {
      setSelectedUrls([trimmed]);
    }
    setCustomUrl("");
    setCustomUrlPreview("");
    setActiveTab("library");
  };

  // Filtering
  const categories = Array.from(new Set(mediaList.map((m) => m.category))).filter(Boolean);

  const filteredMedia = mediaList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === "ALL" || item.category === categoryFilter;
    const matchSource = sourceFilter === "ALL" || item.source === sourceFilter;
    return matchSearch && matchCat && matchSource;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-clay-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] max-h-[850px] shadow-2xl border border-sand-300 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-sand-200 flex items-center justify-between bg-sand-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-clay-900 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-sand-600">
                Sélectionnez une ou plusieurs photos depuis votre galerie ou la banque d&apos;images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-400 hover:text-clay-900 hover:bg-sand-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-sand-200 flex items-center gap-2 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab("library")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "library"
                ? "border-terracotta-600 text-terracotta-700 font-bold"
                : "border-transparent text-sand-600 hover:text-clay-900"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Médiathèque & Banque ({mediaList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "upload"
                ? "border-terracotta-600 text-terracotta-700 font-bold"
                : "border-transparent text-sand-600 hover:text-clay-900"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Téléverser depuis l&apos;appareil</span>
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "url"
                ? "border-terracotta-600 text-terracotta-700 font-bold"
                : "border-transparent text-sand-600 hover:text-clay-900"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Lien Web URL</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-sand-50/30">
          {/* TAB 1: LIBRARY & PRESETS */}
          {activeTab === "library" && (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher une photo (maïs, bétail, huile, tomate...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-clay-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Source Filter */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sand-300 text-xs">
                  <button
                    onClick={() => setSourceFilter("ALL")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                      sourceFilter === "ALL"
                        ? "bg-clay-900 text-white font-medium"
                        : "text-sand-600 hover:text-clay-900"
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setSourceFilter("upload")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                      sourceFilter === "upload"
                        ? "bg-clay-900 text-white font-medium"
                        : "text-sand-600 hover:text-clay-900"
                    }`}
                  >
                    Téléversées
                  </button>
                  <button
                    onClick={() => setSourceFilter("preset")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                      sourceFilter === "preset"
                        ? "bg-clay-900 text-white font-medium"
                        : "text-sand-600 hover:text-clay-900"
                    }`}
                  >
                    Banque Pro
                  </button>
                </div>

                {/* Categories filter dropdown */}
                {categories.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-white border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-medium"
                  >
                    <option value="ALL">Toutes les filières</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={fetchMedia}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white border border-sand-300 text-clay-700 hover:bg-sand-100 transition-colors shrink-0"
                  title="Actualiser la liste"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-terracotta-600" : ""}`} />
                </button>
              </div>

              {/* Error state */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Loading skeleton */}
              {loading && mediaList.length === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-sand-200 animate-pulse border border-sand-300"
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && filteredMedia.length === 0 && (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-sand-200 flex items-center justify-center text-sand-500">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif font-bold text-clay-900 text-sm">
                    Aucune photo correspondante
                  </h4>
                  <p className="text-xs text-sand-600 max-w-sm mx-auto">
                    Essayez de modifier votre recherche ou téléversez directement une photo depuis votre appareil.
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta-600 text-white font-semibold text-xs hover:bg-terracotta-700 shadow-sm transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser une photo maintenant</span>
                  </button>
                </div>
              )}

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredMedia.map((item) => {
                  const isSelected = selectedUrls.includes(item.url);
                  return (
                    <div
                      key={item.url}
                      onClick={() => handleToggleSelect(item.url)}
                      onDoubleClick={() => {
                        onSelectImages([item.url]);
                        onClose();
                      }}
                      title="Cliquez pour sélectionner, ou double-cliquez pour ajouter immédiatement"
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 aspect-square bg-sand-100 flex flex-col justify-end ${
                        isSelected
                          ? "border-terracotta-600 ring-2 ring-terracotta-500/30 shadow-md scale-[0.98]"
                          : "border-transparent hover:border-sand-400 hover:shadow-sm"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-clay-950/80 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

                      {/* Selection Checkmark Badge */}
                      <div
                        className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-terracotta-600 text-white shadow-md scale-110"
                            : "bg-black/40 text-transparent border border-white/60 group-hover:border-white"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      {/* Source tag */}
                      <div className="absolute top-2.5 left-2.5">
                        {item.source === "upload" && (
                          <span className="bg-sage-700/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                            Upload
                          </span>
                        )}
                        {item.source === "preset" && (
                          <span className="bg-harvest-600/90 text-clay-950 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Pro</span>
                          </span>
                        )}
                      </div>

                      {/* Quick Add Button overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                        <span className="px-3 py-1 rounded-full bg-white/95 text-clay-900 text-[11px] font-bold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          {isSelected ? "✓ Sélectionnée" : "+ Sélectionner"}
                        </span>
                      </div>

                      {/* Caption & Category */}
                      <div className="relative p-2.5 text-white z-10">
                        <p className="font-semibold text-xs truncate drop-shadow-sm">{item.title}</p>
                        <p className="text-[10px] text-sand-300 truncate">{item.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FROM DEVICE */}
          {activeTab === "upload" && (
            <div className="max-w-xl mx-auto py-8 space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                  dragOver
                    ? "border-terracotta-500 bg-terracotta-50/50 scale-[1.01]"
                    : "border-sand-300 bg-white hover:border-terracotta-400 hover:bg-sand-50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple={multiple}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />

                <div className="w-16 h-16 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shadow-inner">
                  {uploading ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-clay-900">
                    {uploading ? "Téléversement en cours..." : "Choisir des photos depuis l'appareil"}
                  </h4>
                  <p className="text-xs text-sand-600 mt-1">
                    Glissez-déposez vos fichiers ici, ou cliquez pour parcourir votre galerie photo / explorateur.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-sand-500 pt-2">
                  <span className="bg-sand-100 px-2 py-0.5 rounded">JPG</span>
                  <span className="bg-sand-100 px-2 py-0.5 rounded">PNG</span>
                  <span className="bg-sand-100 px-2 py-0.5 rounded">WEBP</span>
                  <span>(Max 15 Mo par photo)</span>
                </div>
              </div>

              {uploadError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === "url" && (
            <div className="max-w-xl mx-auto py-8 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-sand-300 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-base text-clay-900">
                  Ajouter une image via son adresse Web (URL)
                </h4>
                <p className="text-xs text-sand-600">
                  Collez le lien direct vers une photo hébergée (Unsplash, CDN ou serveur externe) :
                </p>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      setCustomUrlPreview(e.target.value);
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-clay-900 text-xs focus:outline-none focus:border-terracotta-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    disabled={!customUrl.trim()}
                    className="px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {customUrlPreview && (
                  <div className="pt-4 border-t border-sand-200">
                    <p className="text-xs font-semibold text-clay-800 mb-2">Aperçu :</p>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-sand-100 border border-sand-200">
                      <Image
                        src={customUrlPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => setCustomUrlPreview("")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-sand-200 bg-sand-50/70 flex items-center justify-between">
          <div className="text-xs text-clay-700">
            {selectedUrls.length === 0 ? (
              <span className="text-sand-500">Aucune photo sélectionnée</span>
            ) : (
              <span className="font-semibold text-terracotta-700">
                {selectedUrls.length} {selectedUrls.length > 1 ? "photos sélectionnées" : "photo sélectionnée"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-sand-200 hover:bg-sand-300 text-clay-800 font-semibold text-xs transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={selectedUrls.length === 0}
              className="px-5 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white font-bold text-xs shadow-warm-sm transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>
                {selectedUrls.length > 1
                  ? `Ajouter la sélection (${selectedUrls.length})`
                  : "Ajouter la photo"}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
