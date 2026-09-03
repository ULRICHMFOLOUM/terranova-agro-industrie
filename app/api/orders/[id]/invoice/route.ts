import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderNumber: id }],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Facture introuvable." }, { status: 404 });
  }

  // Redirect to formatted invoice page or render printable view
  const invoiceUrl = new URL(`/facture/${order.orderNumber}`, req.url);
  return NextResponse.redirect(invoiceUrl);
}
