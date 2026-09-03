import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Email et nom par défaut ou fournis par le flux Google OAuth
    const email = (body.email || "client.google@terranova.agri").toLowerCase().trim();
    const name = body.name || "Client Google Partenaire";

    // Vérifier si un compte existe déjà avec cet email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Créer automatiquement le compte client associé à Google
      const randomPassword = await hashPassword(`GoogleAuth_${Date.now()}_${Math.random()}`);
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: randomPassword,
          role: "CLIENT",
          city: "Douala",
        },
      });
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "CLIENT",
      phone: user.phone,
    };

    await setAuthCookie(sessionUser);

    return NextResponse.json({
      success: true,
      user: sessionUser,
      redirectUrl: user.role === "ADMIN" ? "/admin" : "/compte",
    });
  } catch (error) {
    console.error("[GOOGLE AUTH ERROR]", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion avec Google." },
      { status: 500 }
    );
  }
}
