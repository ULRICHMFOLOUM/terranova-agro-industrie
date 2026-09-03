import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdminPaymentConfirmed } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { externalId, status, transId } = body;

    if (!externalId) {
      return NextResponse.json({ error: "Missing externalId" }, { status: 400 });
    }

    console.log(`[FAPSHI WEBHOOK] Réception statut "${status}" pour commande ${externalId} (TransId: ${transId})`);

    const order = await prisma.order.findUnique({
      where: { orderNumber: externalId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (status === "SUCCESSFUL" || status === "SUCCESS") {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentStatus: "SUCCESS",
          paymentRef: transId || order.paymentRef,
        },
      });
      console.log(`✅ Commande #${externalId} marquée comme PAYÉE via webhook Fapshi.`);

      // Notifier l'administrateur de l'encaissement
      await notifyAdminPaymentConfirmed({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        totalAmount: updatedOrder.totalAmount,
        paymentRef: transId || updatedOrder.paymentRef,
      });
    } else if (status === "FAILED" || status === "EXPIRED") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PENDING",
          paymentStatus: "FAILED",
        },
      });
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("[FAPSHI WEBHOOK ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
