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
    const products = await prisma.product.findMany({
      include: {
        category: true,
        accompaniments: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, stock, price, isAvailable, isDailySpecial } = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        stock: stock !== undefined ? parseInt(stock) : undefined,
        price: price !== undefined ? parseInt(price) : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
        isDailySpecial: isDailySpecial !== undefined ? isDailySpecial : undefined,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
