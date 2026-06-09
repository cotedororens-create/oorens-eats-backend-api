import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Webhook FeexPay reçu:", payload);

    // Extraction de la référence de transaction et du statut
    const transactionId = payload.transaction_id || payload.reference || payload.id;
    const status = payload.status;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    // Mettre à jour la commande si le paiement est un succès
    if (status === "SUCCESS" || status === "SUCCESSFUL") {
      const order = await prisma.order.findFirst({
        where: { paymentRef: transactionId }
      });

      if (order && order.paymentStatus !== "SUCCESS") {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "SUCCESS" }
        });
        console.log(`Commande ${order.id} marquée comme payée via Webhook.`);
      }
    } else if (status === "FAILED") {
      const order = await prisma.order.findFirst({
        where: { paymentRef: transactionId }
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "FAILED" }
        });
        console.log(`Commande ${order.id} marquée comme échouée via Webhook.`);
      }
    }

    // Toujours renvoyer un statut 200 pour que FeexPay sache qu'on a bien reçu le message
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur Webhook FeexPay:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
