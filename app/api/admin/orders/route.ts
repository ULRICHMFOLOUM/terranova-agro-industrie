import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await req.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de commande manquant." }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : undefined,
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur modification commande" }, { status: 500 });
  }
}
