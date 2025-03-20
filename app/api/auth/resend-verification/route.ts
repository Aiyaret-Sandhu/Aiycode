import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import { randomBytes } from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString("hex")

    await prisma.user.update({
      where: { email },
      data: { verificationToken },
    })

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Resend Verification Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    })

    return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error resending verification email:", error)
    return NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 })
  }
}