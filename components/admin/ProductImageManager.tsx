"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  FolderOpen,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { MediaGalleryModal } from "./MediaGalleryModal";

interface ProductImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ProductImageManager({
  images,
  onChange,
  maxImages = 10,
}: ProductImageManagerProps) {
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set image as cover / primary (move to index 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  // Move image index
  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  // Remove image
  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // Direct device upload handler
  const handleDirectUpload = async (files: FileList | null) => {
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
        // Append new images up to max
        const combined = [...images, ...data.urls].slice(0, maxImages);
        onChange(combined);
      }
    } catch {
      setUploadError("Erreur réseau lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  // Gallery modal selection handler
  const handleSelectFromGallery = (selectedUrls: string[]) => {
    // Avoid duplicate additions
    const toAdd = selectedUrls.filter((url) => !images.includes(url));
    const combined = [...images, ...toAdd].slice(0, maxImages);
    onChange(combined);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-semibold text-clay-900 text-xs">
            Photos du Produit ({images.length}/{maxImages}) *
          </label>
          <p className="text-[11px] text-sand-600">
            La première photo sera affichée comme couverture principale dans le catalogue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct File Input from Device */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => handleDirectUpload(e.target.files)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="px-3 py-1.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Sélectionner depuis l&apos;appareil</span>
          </button>

          <button
            type="button"
            onClick={() => setGalleryModalOpen(true)}
            disabled={images.length >= maxImages}
            className="px-3 py-1.5 rounded-xl bg-sand-200 hover:bg-sand-300 disabled:opacity-50 text-clay-900 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-clay-700" />
            <span>Médiathèque</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Grid of current images or drag-drop zone */}
      {images.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleDirectUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? "border-terracotta-500 bg-terracotta-50"
              : "border-sand-300 bg-sand-50/60 hover:border-terracotta-400 hover:bg-sand-100/50"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-sand-200 text-sand-600 flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-terracotta-600" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
          <p className="text-xs font-semibold text-clay-900">
            {uploading ? "Téléversement en cours..." : "Aucune photo sélectionnée pour ce produit"}
          </p>
          <p className="text-[11px] text-sand-600 max-w-sm">
            Cliquez pour choisir une photo dans la galerie de votre appareil ou glissez-déposez ici.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="px-3 py-1 bg-white rounded-lg border border-sand-300 text-clay-800 text-[11px] font-medium shadow-2xs">
              📁 Galerie de l&apos;appareil
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryModalOpen(true);
              }}
              className="px-3 py-1 bg-terracotta-50 rounded-lg border border-terracotta-200 text-terracotta-700 text-[11px] font-medium hover:bg-terracotta-100"
            >
              🖼️ Ouvrir la Médiathèque
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((imgUrl, idx) => {
              const isCover = idx === 0;
              return (
                <div
                  key={`${imgUrl}-${idx}`}
                  className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all bg-sand-100 shadow-sm ${
                    isCover
                      ? "border-harvest-500 ring-2 ring-harvest-400/30"
                      : "border-sand-300 hover:border-sand-400"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Photo produit ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />

                  {/* Gradient shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-clay-950/70 via-transparent to-clay-950/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    {isCover ? (
                      <span className="bg-harvest-500 text-clay-950 text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 pointer-events-auto">
                        <Star className="w-2.5 h-2.5 fill-clay-950" />
                        <span>Principale</span>
                      </span>
                    ) : (
                      <span className="bg-clay-950/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                        #{idx + 1}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 rounded-lg bg-red-600/90 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto shadow-sm"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bottom Actions on hover */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className="p-1 rounded-lg bg-white/90 text-harvest-600 hover:bg-white text-[10px] font-semibold flex items-center gap-1 shadow-sm"
                        title="Définir comme photo principale"
                      >
                        <Star className="w-3 h-3" />
                        <span>Couverture</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1 ml-auto">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(idx, idx - 1)}
                          className="p-1 rounded-lg bg-clay-900/80 text-white hover:bg-clay-900 shadow-sm"
                          title="Déplacer vers la gauche"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMove(idx, idx + 1)}
                          className="p-1 rounded-lg bg-clay-900/80 text-white hover:bg-clay-900 shadow-sm"
                          title="Déplacer vers la droite"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add More Tile */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => setGalleryModalOpen(true)}
                className="rounded-2xl border-2 border-dashed border-sand-300 hover:border-terracotta-500 hover:bg-terracotta-50/50 aspect-square flex flex-col items-center justify-center gap-1 text-sand-600 hover:text-terracotta-700 transition-colors p-3"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[11px] font-semibold">Ajouter</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Media Gallery Modal Dialog */}
      <MediaGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onSelectImages={handleSelectFromGallery}
        multiple={true}
        title="Sélectionner des Photos pour le Produit"
      />
    </div>
  );
}
