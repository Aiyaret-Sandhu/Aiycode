import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // If user doesn't exist, return an error
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if the user's email is verified
    if (!user.emailVerified) {
      return NextResponse.json({ error: "Please verify your email before signing in" }, { status: 403 })
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Replace with a secure secret in production
      { expiresIn: "1h" } // Token expires in 1 hour
    )

    // Optionally, you can store the token in a cookie
    const response = NextResponse.json({ message: "Sign-in successful", token })
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}