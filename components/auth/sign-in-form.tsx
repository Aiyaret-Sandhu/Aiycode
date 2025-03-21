"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setResendMessage(null)
  
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
  
    
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(text)
      }
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email")
      }
  
      setResendMessage("Verification email sent successfully. Please check your inbox.")
    } catch (error) {
      setResendMessage(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
{error && (
        <div className="p-3 text-red-500 bg-red-50 rounded">
          <div>{error}</div>
          {error === "Email verification pending. Please verify your email." && (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isResending ? "Resending..." : "Resend Verification Email"}
            </button>
          )}
          {resendMessage && <p className="mt-2 text-sm text-gray-600">{resendMessage}</p>}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password">Password</label>
          <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
}

