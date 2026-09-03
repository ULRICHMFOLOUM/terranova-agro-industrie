import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, address, city } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre nom, email et mot de passe." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        phone: phone || null,
        address: address || null,
        city: city || null,
        role: "CLIENT",
      },
    });

    const sessionUser: SessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "CLIENT",
      phone: newUser.phone,
    };

    await setAuthCookie(sessionUser);

    return NextResponse.json({
      success: true,
      user: sessionUser,
      redirectUrl: "/compte",
    });
  } catch (error) {
    console.error("[AUTH REGISTER ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la création du compte." }, { status: 500 });
  }
}
