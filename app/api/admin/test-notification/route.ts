import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const res = await sendTelegramMessage(
      `🌾 <b>TEST DE NOTIFICATION TERRANOVA AGRO</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ Votre bot Telegram de notification est <b>parfaitement connecté</b> !\n` +
      `📦 Vous recevrez ici une alerte instantanée à chaque nouvelle commande avec les coordonnées du client et l'adresse de livraison.\n` +
      `⏰ <i>${new Date().toLocaleString("fr-FR")}</i>`
    );

    if (!res.success) {
      return NextResponse.json({
        success: false,
        error: res.error || "Impossible d'envoyer le message Telegram. Vérifiez votre TOKEN et CHAT_ID dans .env.",
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Notification test envoyée avec succès sur Telegram !",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erreur serveur" }, { status: 500 });
  }
}
