import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setAuthCookie, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
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
    console.error("[AUTH LOGIN ERROR]", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}
