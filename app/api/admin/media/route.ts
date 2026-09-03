import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// Collection prédéfinie de photos professionnelles agro-industrielles & pastorales
const PRESET_MEDIA_GALLERY = [
  // Céréales & Grains
  {
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000",
    title: "Maïs Jaune & Grains Séchés",
    category: "Céréales & Grains",
  },
  {
    url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000",
    title: "Riz Blanc & Paddy de Haute Qualité",
    category: "Céréales & Grains",
  },
  {
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000",
    title: "Farine & Blé Raffiné",
    category: "Céréales & Grains",
  },
  {
    url: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=1000",
    title: "Graines de Soja & Protéagineux",
    category: "Céréales & Grains",
  },
  {
    url: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=1000",
    title: "Sorgho & Grains Traditionnels",
    category: "Céréales & Grains",
  },

  // Élevage & Bétail
  {
    url: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000",
    title: "Bovins de Race & Génisses Goudali",
    category: "Élevage & Bétail",
  },
  {
    url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000",
    title: "Taureau Reproducteur & Bœufs de Pâturage",
    category: "Élevage & Bétail",
  },
  {
    url: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000",
    title: "Poulets de Chair & Volailles Fermières",
    category: "Élevage & Bétail",
  },
  {
    url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1000",
    title: "Porcins & Porcelets Hybrides",
    category: "Élevage & Bétail",
  },
  {
    url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=1000",
    title: "Œufs Frais de Table Calibre Gros",
    category: "Élevage & Bétail",
  },
  {
    url: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1000",
    title: "Caprins & Moutons Djallonké",
    category: "Élevage & Bétail",
  },

  // Huiles & Oléagineux
  {
    url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000",
    title: "Huile de Palme Rouge Brute & Clarifiée",
    category: "Huiles & Oléagineux",
  },
  {
    url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000",
    title: "Huile de Tournesol / Soja Raffinée",
    category: "Huiles & Oléagineux",
  },
  {
    url: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=1000",
    title: "Tourteaux & Résidus d'Alimentation Animale",
    category: "Huiles & Oléagineux",
  },

  // Maraîchage, Racines & Tubercules
  {
    url: "https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=1000",
    title: "Tomates Fraîches & Maraîchage",
    category: "Maraîchage & Fruits",
  },
  {
    url: "https://images.unsplash.com/photo-1526346698789-224822f00545?q=80&w=1000",
    title: "Banane Plantain & Régimes Sélectionnés",
    category: "Maraîchage & Fruits",
  },
  {
    url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000",
    title: "Manioc, Tubercules & Racines",
    category: "Maraîchage & Fruits",
  },
  {
    url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000",
    title: "Carottes & Légumes Racines",
    category: "Maraîchage & Fruits",
  },
  {
    url: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000",
    title: "Oignons Rouges & Bulbes",
    category: "Maraîchage & Fruits",
  },

  // Épices & Cultures d'Exportation
  {
    url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1000",
    title: "Poivre Blanc de Penja & Épices Rares",
    category: "Épices & Spécialités",
  },
  {
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000",
    title: "Café Arabica & Robusta des Hauts-Plateaux",
    category: "Épices & Spécialités",
  },
  {
    url: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?q=80&w=1000",
    title: "Fèves de Cacao Fermentées",
    category: "Épices & Spécialités",
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAuth("ADMIN");

    // 1. Scanner le répertoire local `public/uploads`
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const localUploads: Array<{
      url: string;
      title: string;
      category: string;
      source: "upload" | "database" | "preset";
      createdAt?: string;
    }> = [];

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        // Ignorer les fichiers cachés
        if (file.startsWith(".")) continue;
        const ext = path.extname(file).toLowerCase();
        if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) {
          const stats = fs.statSync(path.join(uploadsDir, file));
          localUploads.push({
            url: `/uploads/${file}`,
            title: file.replace(/^\d+-/, ""),
            category: "Téléchargements Locaux",
            source: "upload",
            createdAt: stats.mtime.toISOString(),
          });
        }
      }
      // Trier par plus récent
      localUploads.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    // 2. Extraire les images déjà enregistrées dans les produits et catégories de la BD
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        select: { id: true, name: true, images: true, category: { select: { name: true } } },
      }),
      prisma.category.findMany({
        select: { id: true, name: true, image: true },
      }),
    ]);

    const dbMedia: Array<{
      url: string;
      title: string;
      category: string;
      source: "upload" | "database" | "preset";
    }> = [];

    const seenUrls = new Set<string>();
    localUploads.forEach((item) => seenUrls.add(item.url));

    for (const p of products) {
      try {
        let imgs: string[] = [];
        if (p.images.startsWith("[")) {
          imgs = JSON.parse(p.images);
        } else if (p.images) {
          imgs = [p.images];
        }

        for (const imgUrl of imgs) {
          if (imgUrl && !seenUrls.has(imgUrl)) {
            seenUrls.add(imgUrl);
            dbMedia.push({
              url: imgUrl,
              title: p.name,
              category: p.category?.name || "Catalogue",
              source: "database",
            });
          }
        }
      } catch {}
    }

    for (const c of categories) {
      if (c.image && !seenUrls.has(c.image)) {
        seenUrls.add(c.image);
        dbMedia.push({
          url: c.image,
          title: `Catégorie ${c.name}`,
          category: c.name,
          source: "database",
        });
      }
    }

    // 3. Préparer les presets
    const presets = PRESET_MEDIA_GALLERY.filter((item) => !seenUrls.has(item.url)).map(
      (item) => ({
        ...item,
        source: "preset" as const,
      })
    );

    return NextResponse.json({
      success: true,
      media: {
        uploads: localUploads,
        database: dbMedia,
        presets: presets,
        all: [...localUploads, ...dbMedia, ...presets],
      },
    });
  } catch (error: any) {
    console.error("[ADMIN MEDIA API ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la récupération des médias." },
      { status: 500 }
    );
  }
}
