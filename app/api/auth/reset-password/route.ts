import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
        return NextResponse.json(
          { error: "Token and password are required" },
          { status: 400 }
        )
      }
      
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12)

    // Update user's password and clear reset token
    try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        })
      } catch (updateError) {
        console.error("Failed to update user:", updateError)
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 500 }
        )
      }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}