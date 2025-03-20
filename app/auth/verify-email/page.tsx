"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      if (!token) {
        setStatus("error")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        if (!response.ok) {
          throw new Error("Verification failed")
        }
        setStatus("success")
        setTimeout(() => {
          router.push("/auth/signin")
        }, 5000) // Redirect to sign-in page after 5 seconds
      } catch (error) {
        setStatus("error")
      }
    }

    verifyEmail()
  }, [router, searchParams])

  if (status === "loading") {
    return <p>Verifying your email...</p>
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-500">Verification Failed</h1>
        <p className="mt-4 text-gray-600">The verification link is invalid or has expired.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <h1 className="text-2xl font-bold">Email Verified</h1>
      <p className="mt-4 text-gray-600">
        Your email has been successfully verified. You will be redirected to the sign-in page shortly.
      </p>
    </div>
  )
}