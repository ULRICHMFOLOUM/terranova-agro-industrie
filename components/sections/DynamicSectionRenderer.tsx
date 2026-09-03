import React from "react";
import { HeroSection } from "./HeroSection";
import { CategoriesSection } from "./CategoriesSection";
import { StoryValuesSection } from "./StoryValuesSection";
import { KeyMetricsSection } from "./KeyMetricsSection";
import { QualityTraceabilitySection } from "./QualityTraceabilitySection";
import { TestimonialsSection } from "./TestimonialsSection";
import { GallerySection } from "./GallerySection";
import { CtaBannerSection } from "./CtaBannerSection";

export interface SectionData {
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

interface DynamicSectionRendererProps {
  sections: SectionData[];
  categories: any[];
}

export function DynamicSectionRenderer({ sections, categories }: DynamicSectionRendererProps) {
  // Filtrer uniquement les sections visibles et les trier selon l'ordre configuré
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      {visibleSections.map((sec) => {
        switch (sec.type) {
          case "HERO":
            return (
              <HeroSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={sec.content}
                badge={sec.badge}
                metadata={sec.metadata}
              />
            );

          case "CATEGORIES_HIGHLIGHT":
            return (
              <CategoriesSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                categories={categories}
              />
            );

          case "STORY_VALUES":
            return (
              <StoryValuesSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={sec.content}
                badge={sec.badge}
                mediaUrl={sec.mediaUrl}
                secondaryMediaUrl={sec.secondaryMediaUrl}
                metadata={sec.metadata}
              />
            );

          case "KEY_METRICS":
            return (
              <KeyMetricsSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                metadata={sec.metadata}
              />
            );

          case "QUALITY_TRACEABILITY":
            return (
              <QualityTraceabilitySection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={sec.content}
                badge={sec.badge}
                mediaUrl={sec.mediaUrl}
                metadata={sec.metadata}
              />
            );

          case "TESTIMONIALS":
            return (
              <TestimonialsSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                metadata={sec.metadata}
              />
            );

          case "GALLERY":
            return (
              <GallerySection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                metadata={sec.metadata}
              />
            );

          case "CTA_BANNER":
            return (
              <CtaBannerSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                metadata={sec.metadata}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
