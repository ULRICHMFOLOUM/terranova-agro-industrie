import { NextResponse } from "next/server";
import { clearAuthCookie, getSession } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const user = await getSession();
  return NextResponse.json({ user });
}
