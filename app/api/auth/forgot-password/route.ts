import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      },
    })

    // Create nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the following link to reset your password:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    )
  }
}