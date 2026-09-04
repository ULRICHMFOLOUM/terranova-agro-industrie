import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ products: [] });
    }

    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        status: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[SYNC CART ERROR]", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
