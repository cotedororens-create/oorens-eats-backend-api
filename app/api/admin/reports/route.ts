import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Chiffre d'affaires par jour
    const dailyRevenue = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        paymentStatus: "SUCCESS",
        createdAt: { gte: sevenDaysAgo }
      },
      _sum: {
        totalAmount: true
      }
    });

    // 2. Produits les plus vendus
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      _count: {
        productId: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    // Récupérer les noms des produits
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (p) => {
        const product = await prisma.product.findUnique({
          where: { id: p.productId },
          select: { name: true }
        });
        return {
          name: product?.name || "Inconnu",
          quantity: p._sum.quantity,
          count: p._count.productId
        };
      })
    );

    // 3. Répartition Livraison vs Sur Place
    const deliveryStats = await prisma.order.groupBy({
      by: ['deliveryMode'],
      where: { paymentStatus: "SUCCESS" },
      _count: {
        id: true
      }
    });

    // 4. Statistiques par caissier (aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cashierStats = await prisma.order.groupBy({
      by: ['profileId'],
      where: {
        createdAt: { gte: today },
        status: "DELIVERED"
      },
      _count: {
        id: true
      },
      _sum: {
        totalAmount: true
      }
    });

    const cashierStatsWithNames = await Promise.all(
      cashierStats.map(async (s) => {
        if (!s.profileId) return null;
        const profile = await prisma.cashierProfile.findUnique({
          where: { id: s.profileId },
          select: { name: true }
        });
        return {
          name: profile?.name || "Inconnu",
          count: s._count.id,
          total: s._sum.totalAmount
        };
      })
    ).then(res => res.filter(Boolean));

    return NextResponse.json({
      dailyRevenue,
      topProducts: topProductsWithDetails,
      deliveryStats,
      cashierStats: cashierStatsWithNames
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
