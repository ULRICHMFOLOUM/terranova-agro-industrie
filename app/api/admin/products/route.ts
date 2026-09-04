import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const {
      name,
      categoryId,
      description,
      shortDesc,
      price,
      unit,
      stock,
      sku,
      status,
      featured,
      images,
      specs,
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: "Le nom, la catégorie et le prix sont obligatoires." },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        categoryId,
        description: description || "",
        shortDesc: shortDesc || null,
        price: Number(price),
        unit: unit || "kg",
        stock: Number(stock) || 0,
        sku: sku || null,
        status: status || "ACTIVE",
        featured: Boolean(featured),
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        specs: typeof specs === "string" ? specs : JSON.stringify(specs || {}),
      },
      include: { category: true },
    });

    // Invalider le cache Next.js pour afficher les modifications immédiatement
    try {
      revalidatePath("/", "page");
      revalidatePath("/catalogue", "page");
      revalidatePath(`/produits/${slug}`, "page");
      revalidatePath("/admin/produits", "page");
    } catch (e) {
      console.warn("[REVALIDATE ERROR]", e);
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur création produit" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID produit requis." }, { status: 400 });
    }

    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name.trim();
      updateData.slug = slugify(data.name);
    }
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.images !== undefined) {
      updateData.images = typeof data.images === "string" ? data.images : JSON.stringify(data.images);
    }
    if (data.specs !== undefined) {
      updateData.specs = typeof data.specs === "string" ? data.specs : JSON.stringify(data.specs);
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    // Invalider le cache Next.js pour afficher les modifications immédiatement
    try {
      revalidatePath("/", "page");
      revalidatePath("/catalogue", "page");
      if (product.slug) {
        revalidatePath(`/produits/${product.slug}`, "page");
      }
      revalidatePath("/admin/produits", "page");
    } catch (e) {
      console.warn("[REVALIDATE ERROR]", e);
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur modification produit" }, { status: 500 });
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

    const deleted = await prisma.product.delete({ where: { id } });

    // Invalider le cache Next.js
    try {
      revalidatePath("/", "page");
      revalidatePath("/catalogue", "page");
      if (deleted.slug) {
        revalidatePath(`/produits/${deleted.slug}`, "page");
      }
      revalidatePath("/admin/produits", "page");
    } catch (e) {
      console.warn("[REVALIDATE ERROR]", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur suppression produit" }, { status: 500 });
  }
}
