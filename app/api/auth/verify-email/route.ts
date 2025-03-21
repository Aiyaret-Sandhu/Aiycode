import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  })

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: null,
      emailVerified: true,
    },
  })

  return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
}