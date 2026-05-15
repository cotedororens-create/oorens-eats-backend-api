import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { profileId, pin } = await req.json();

    const profile = await prisma.cashierProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Compare PIN
    const isMatch = await bcrypt.compare(pin, profile.pin);
    
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
