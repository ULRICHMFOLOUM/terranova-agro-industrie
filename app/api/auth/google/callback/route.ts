import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, SessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const origin = req.nextUrl.origin;

  let returnTo = "/compte";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (decoded.returnTo && decoded.returnTo.startsWith("/")) {
        returnTo = decoded.returnTo;
      }
    } catch {
      // Ignorer l'erreur et garder le fallback /compte
    }
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=google_cancelled", origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/auth/login?error=google_config_missing", origin));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`;

  try {
    // 1. Échange du code d'autorisation contre les tokens Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[GOOGLE TOKEN ERROR]", tokenData);
      return NextResponse.redirect(new URL("/auth/login?error=google_token_failed", origin));
    }

    // 2. Récupération des informations de profil Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok || !userInfo.email) {
      console.error("[GOOGLE USERINFO ERROR]", userInfo);
      return NextResponse.redirect(new URL("/auth/login?error=google_userinfo_failed", origin));
    }

    const email = userInfo.email.toLowerCase().trim();
    const name = userInfo.name || userInfo.given_name || "Client Partenaire";

    // 3. Recherche ou création du compte dans la base PostgreSQL Neon
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const randomPassword = await hashPassword(`GoogleOAuth_${Date.now()}_${Math.random()}`);
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: randomPassword,
          role: "CLIENT",
          city: "Douala",
        },
      });
    }

    // 4. Création de la session sécurisée
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "CLIENT",
      phone: user.phone,
    };

    await setAuthCookie(sessionUser);

    // Redirection vers l'espace désiré (Admin si ADMIN, sinon compte ou checkout)
    const destination = user.role === "ADMIN" && returnTo === "/compte" ? "/admin" : returnTo;
    return NextResponse.redirect(new URL(destination, origin));
  } catch (error) {
    console.error("[GOOGLE OAUTH CALLBACK ERROR]", error);
    return NextResponse.redirect(new URL("/auth/login?error=google_oauth_server_error", origin));
  }
}
