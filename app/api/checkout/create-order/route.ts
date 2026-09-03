import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateOrderNumber, generateInvoiceNumber } from "@/lib/utils";
import { initiateFapshiPayment } from "@/lib/fapshi";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { notifyAdminNewOrder } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      customerNotes,
      paymentMethod,
      items,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Veuillez renseigner toutes les informations de commande obligatoires." },
        { status: 400 }
      );
    }

    // Calculer les totaux de manière sécurisée côté serveur
    let subtotal = 0;
    const verifiedOrderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produit "${item.name}" non trouvé en base.` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${product.name}". Disponible : ${product.stock}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      verifiedOrderItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        unit: product.unit,
        totalRow: itemTotal,
      });

      // Mettre à jour le stock disponible
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const shippingFee = 0; // Offert pour commande agro-industrielle
    const totalAmount = subtotal + shippingFee;
    const orderNumber = generateOrderNumber();
    const invoiceNumber = generateInvoiceNumber(orderNumber);

    // Initialiser le statut selon la méthode
    let initialStatus = "PENDING";
    let initialPaymentStatus = "PENDING";

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: sessionUser?.id || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress?.trim() || "Retrait domaine / À convenir",
        shippingCity: shippingCity?.trim() || "Douala",
        customerNotes: customerNotes?.trim() || null,
        subtotal,
        taxAmount: 0,
        shippingFee,
        totalAmount,
        status: initialStatus,
        paymentMethod: paymentMethod || "FAPSHI_MOMO",
        paymentStatus: initialPaymentStatus,
        invoiceNumber,
        invoiceUrl: `/api/orders/${orderNumber}/invoice`,
        items: {
          create: verifiedOrderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Envoi de notification email transactionnelle au client
    await sendOrderConfirmationEmail({
      to: customerEmail,
      subject: `Confirmation de commande #${orderNumber} — TERRANOVA AGRO`,
      customerName,
      orderNumber,
      totalAmount,
      items: verifiedOrderItems.map(it => ({
        name: it.productName,
        quantity: it.quantity,
        unit: it.unit,
        totalRow: it.totalRow,
      })),
      invoiceUrl: `/facture/${orderNumber}`,
    });

    // Envoi de notification instantanée GRATUITE à l'administrateur (Telegram + Email Admin)
    await notifyAdminNewOrder({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: shippingAddress?.trim() || "Retrait domaine / À convenir",
      shippingCity: shippingCity?.trim() || "Douala",
      customerNotes: customerNotes?.trim() || null,
      totalAmount,
      paymentMethod: paymentMethod || "FAPSHI_MOMO",
      paymentStatus: initialPaymentStatus,
      items: verifiedOrderItems,
    });

    // Traitement du paiement Fapshi si sélectionné
    if (paymentMethod === "FAPSHI_MOMO" || paymentMethod === "FAPSHI_OM") {
      const fapshiRes = await initiateFapshiPayment({
        amount: totalAmount,
        email: customerEmail,
        userId: sessionUser?.id || "GUEST",
        externalId: orderNumber,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?orderNumber=${orderNumber}`,
        message: `Paiement commande ${orderNumber} - TERRANOVA`,
      });

      await prisma.order.update({
        where: { id: newOrder.id },
        data: {
          paymentRef: fapshiRes.transId,
        },
      });

      return NextResponse.json({
        success: true,
        orderNumber,
        paymentLink: fapshiRes.link || `/checkout/fapshi-sandbox?transId=${fapshiRes.transId}&orderNumber=${orderNumber}&amount=${totalAmount}`,
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      redirectUrl: `/checkout/success?orderNumber=${orderNumber}`,
    });
  } catch (error: any) {
    console.error("[CREATE ORDER ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la création de la commande." },
      { status: 500 }
    );
  }
}
