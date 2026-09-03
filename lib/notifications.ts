import { formatPrice } from "./utils";

export interface NotificationOrderData {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  customerNotes?: string | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef?: string | null;
  items: Array<{
    productName?: string;
    name?: string;
    quantity: number;
    unit?: string;
    totalRow: number;
  }>;
}

/**
 * Envoie un message Telegram instantané et gratuit à l'administrateur
 */
export async function sendTelegramMessage(text: string): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken.includes("your_bot") || chatId.includes("your_chat")) {
    console.log("[TELEGRAM LOG (Non configuré en .env)]");
    console.log(text.replace(/<[^>]*>/g, "")); // Affiche le texte propre dans les logs
    return { success: false, error: "Variables TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID non configurées." };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.warn("[TELEGRAM API WARNING]", data);
      return { success: false, error: data.description || "Erreur Telegram API" };
    }

    console.log("✅ [TELEGRAM] Notification envoyée avec succès à l'admin.");
    return { success: true };
  } catch (error: any) {
    console.error("[TELEGRAM EXCEPTION]", error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Envoie une alerte complète à l'administrateur dès qu'une nouvelle commande est passée
 */
export async function notifyAdminNewOrder(order: NotificationOrderData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");

  const itemsList = order.items
    .map(
      (it) =>
        `  ▫️ <b>${it.productName || it.name}</b> : ${it.quantity} ${it.unit || "u"} (<i>${formatPrice(it.totalRow)}</i>)`
    )
    .join("\n");

  const telegramMsg = `🌾 <b>NOUVELLE COMMANDE À LIVRER — TERRANOVA</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>N° Commande :</b> <code>#${order.orderNumber}</code>\n` +
    `👤 <b>Client :</b> ${order.customerName}\n` +
    `📞 <b>Téléphone :</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>\n` +
    `📧 <b>Email :</b> ${order.customerEmail}\n` +
    `📍 <b>Lieu de livraison :</b> ${order.shippingAddress}, ${order.shippingCity}\n` +
    (order.customerNotes ? `📝 <b>Note spéciale :</b> <i>${order.customerNotes}</i>\n` : "") +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🛒 <b>Articles commandés :</b>\n${itemsList}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 <b>TOTAL À ENCAISSER :</b> <b>${formatPrice(order.totalAmount)}</b>\n` +
    `💳 <b>Paiement :</b> ${order.paymentMethod} (${order.paymentStatus === "SUCCESS" ? "✅ Déjà payé" : "⏳ En attente"})\n\n` +
    `📲 <a href="https://wa.me/${cleanPhone}">Écrire au client sur WhatsApp</a>\n` +
    `📄 <a href="${appUrl}/facture/${order.orderNumber}">Ouvrir le Bon de Livraison / Facture</a>`;

  // 1. Envoi Telegram
  await sendTelegramMessage(telegramMsg);

  // 2. Envoi Email Transactionnel Admin
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.NEXT_PUBLIC_FIRM_EMAIL ||
    "contact@terranova.agri";

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.includes("sample")) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "TERRANOVA Commandes <commandes@terranova.agri>",
          to: [adminEmail],
          subject: `🚨 [NOUVELLE COMMANDE] #${order.orderNumber} - ${order.customerName} (${formatPrice(order.totalAmount)})`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1E281F; border: 1px solid #EAE4D7; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #1E281F; padding: 20px; text-align: center; color: #FBF9F5;">
                <h2 style="margin: 0; color: #E6AF2E;">NOUVELLE COMMANDE À LIVRER</h2>
                <p style="margin: 4px 0 0 0; font-size: 13px;">Commande #${order.orderNumber}</p>
              </div>
              <div style="padding: 24px; background-color: #FBF9F5;">
                <p><strong>Destinataire :</strong> ${order.customerName} (${order.customerPhone})</p>
                <p><strong>Adresse de livraison :</strong> ${order.shippingAddress}, ${order.shippingCity}</p>
                <p><strong>Montant Total :</strong> <span style="color: #C26526; font-size: 18px; font-weight: bold;">${formatPrice(order.totalAmount)}</span></p>
                <hr style="border: none; border-top: 1px solid #EAE4D7; margin: 16px 0;" />
                <h3>Articles :</h3>
                <ul>
                  ${order.items.map((it) => `<li>${it.productName || it.name} × ${it.quantity} ${it.unit || ""} — ${formatPrice(it.totalRow)}</li>`).join("")}
                </ul>
                <p style="margin-top: 24px;">
                  <a href="${appUrl}/facture/${order.orderNumber}" style="background-color: #1E281F; color: #FFF; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Voir la Facture & Bon de Livraison
                  </a>
                </p>
              </div>
            </div>
          `,
        }),
      });
    } catch (e) {
      console.warn("[ADMIN EMAIL ALERT ERROR]", e);
    }
  }
}

/**
 * Notifie l'administrateur lorsqu'un paiement en ligne Fapshi est validé avec succès
 */
export async function notifyAdminPaymentConfirmed(order: {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  paymentRef?: string | null;
}) {
  const telegramMsg = `💰 <b>PAIEMENT CONFIRMÉ FAPSHI — TERRANOVA</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>Commande :</b> <code>#${order.orderNumber}</code>\n` +
    `👤 <b>Client :</b> ${order.customerName}\n` +
    `💵 <b>Montant encaissé :</b> <b>${formatPrice(order.totalAmount)}</b>\n` +
    `🧾 <b>Réf Transaction :</b> <code>${order.paymentRef || "FAPSHI-OK"}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ La commande peut maintenant être expédiée par l'équipe logistique.`;

  await sendTelegramMessage(telegramMsg);
}

/**
 * Génère le message WhatsApp pré-formaté à destination du livreur ou transporteur
 */
export function generateDeliveryDriverWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  customerNotes?: string | null;
  totalAmount: number;
  paymentStatus: string;
  items: Array<{ productName?: string; quantity: number; unit?: string }>;
}): string {
  const itemsText = order.items
    .map((it) => `- ${it.productName} (x${it.quantity} ${it.unit || ""})`)
    .join("\n");

  const msg = `📦 *ORDRE DE LIVRAISON TERRANOVA AGRO*\n` +
    `--------------------------------\n` +
    `*N° Commande :* #${order.orderNumber}\n` +
    `*Client :* ${order.customerName}\n` +
    `*Téléphone :* ${order.customerPhone}\n` +
    `*Ville / Quartier :* ${order.shippingCity} - ${order.shippingAddress}\n` +
    (order.customerNotes ? `*Note de livraison :* ${order.customerNotes}\n` : "") +
    `--------------------------------\n` +
    `*Articles à charger :*\n${itemsText}\n` +
    `--------------------------------\n` +
    `*Montant :* ${formatPrice(order.totalAmount)}\n` +
    `*Statut Encaissement :* ${order.paymentStatus === "SUCCESS" ? "✅ DÉJÀ PAYÉ" : "⚠️ À ENCAISSER À LA LIVRAISON"}\n\n` +
    `Merci de confirmer la prise en charge du colis.`;

  return encodeURIComponent(msg);
}
