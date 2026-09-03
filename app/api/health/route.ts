import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const envStatus = {
    hasDatabaseUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 15) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const sectionCount = await prisma.section.count();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      counts: {
        categories: categoryCount,
        products: productCount,
        sections: sectionCount,
      },
      env: envStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        errorMessage: error?.message || String(error),
        errorCode: error?.code || null,
        errorName: error?.name || null,
        env: envStatus,
      },
      { status: 500 }
    );
  }
}
