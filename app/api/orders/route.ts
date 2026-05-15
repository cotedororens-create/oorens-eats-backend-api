import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    // Vérifier si la commande est déjà prise par un autre caissier
    if (status === "PROCESSING") {
      const existing = await prisma.order.findUnique({
        where: { id },
        select: { profileId: true }
      });

      if (existing?.profileId && existing.profileId !== session.user.profile?.id) {
        return NextResponse.json({ error: "Cette commande est déjà traitée par un autre caissier" }, { status: 403 });
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        cashierId: session.user.id,
        profileId: session.user.profile?.id
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      totalAmount,
      items,
      customerName,
      customerPhone,
      deliveryMode,
      location,
      paymentRef,
    } = body;

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        totalAmount,
        customerName,
        customerPhone,
        deliveryMode,
        location,
        paymentRef,
        paymentStatus: "SUCCESS", // On assume que cet API est appelé après succès FeexPay
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            accompLabel: item.accompLabel,
            accompPrice: item.accompPrice,
          })),
        },
      },
    });

    // Optionnel: Mettre à jour les stocks
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
