import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const specials = await prisma.product.findMany({
      where: {
        isDailySpecial: true,
        isAvailable: true,
      },
      include: {
        category: true,
        accompaniments: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(specials);
  } catch (error) {
    console.error("Specials fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch specials" }, { status: 500 });
  }
}
