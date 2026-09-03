import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get("returnTo") || "/compte";

  if (!clientId) {
    // Si la clé Google n'est pas encore définie, renvoyer sur la page de login avec un message explicatif
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(
      new URL(`/auth/login?error=google_config_missing`, origin)
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`;

  const state = Buffer.from(JSON.stringify({ returnTo })).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
