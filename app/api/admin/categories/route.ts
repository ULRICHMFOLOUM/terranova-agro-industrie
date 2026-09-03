import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const { name, description, image, order, active } = body;

    if (!name) {
      return NextResponse.json({ error: "Le nom est obligatoire." }, { status: 400 });
    }

    const slug = slugify(name);

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description || "",
        image: image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800",
        order: Number(order) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur création catégorie" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const { id, name, description, image, order, active } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID et nom requis." }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slugify(name),
        description: description !== undefined ? description : undefined,
        image: image !== undefined ? image : undefined,
        order: order !== undefined ? Number(order) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur modification catégorie" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    // Vérifier si la catégorie contient des produits
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette catégorie car elle contient ${productsCount} produit(s). Veuillez d'abord réassigner ou supprimer ces produits.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur suppression" }, { status: 500 });
  }
}
