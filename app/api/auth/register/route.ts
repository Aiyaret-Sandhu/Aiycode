import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({ 
          where: { name } 
        })
        if (existingUsername) {
          return NextResponse.json(
            { message: "Username already taken" }, 
            { status: 409 }
          )
        }
    
        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({ 
          where: { email } 
        })
        if (existingEmail) {
          return NextResponse.json(
            { message: "Email already registered" }, 
            { status: 409 }
          )
        }    

    const hashedPassword = await hash(password, 10)
    const verificationToken = randomBytes(32).toString("hex")

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
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
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    })

    return NextResponse.json({ message: "User registered. Please verify your email." }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}