import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ sections });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const { type, title, subtitle, content, badge, mediaUrl, secondaryMediaUrl, metadata, order, visible } = body;

    if (!type || !title) {
      return NextResponse.json({ error: "Le type et le titre sont obligatoires." }, { status: 400 });
    }

    const section = await prisma.section.create({
      data: {
        type,
        title: title.trim(),
        subtitle: subtitle || null,
        content: content || null,
        badge: badge || null,
        mediaUrl: mediaUrl || null,
        secondaryMediaUrl: secondaryMediaUrl || null,
        metadata: metadata ? (typeof metadata === "string" ? metadata : JSON.stringify(metadata)) : null,
        order: Number(order) || 0,
        visible: visible !== undefined ? Boolean(visible) : true,
      },
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur création section" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const { id, type, title, subtitle, content, badge, mediaUrl, secondaryMediaUrl, metadata, order, visible } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de section manquant." }, { status: 400 });
    }

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (content !== undefined) updateData.content = content;
    if (badge !== undefined) updateData.badge = badge;
    if (mediaUrl !== undefined) updateData.mediaUrl = mediaUrl;
    if (secondaryMediaUrl !== undefined) updateData.secondaryMediaUrl = secondaryMediaUrl;
    if (metadata !== undefined) {
      updateData.metadata = typeof metadata === "string" ? metadata : JSON.stringify(metadata);
    }
    if (order !== undefined) updateData.order = Number(order);
    if (visible !== undefined) updateData.visible = Boolean(visible);

    const section = await prisma.section.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur modification section" }, { status: 500 });
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

    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur suppression section" }, { status: 500 });
  }
}
