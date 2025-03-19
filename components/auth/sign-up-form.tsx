"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Password validation function with separate checks
const getPasswordStrength = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

const isPasswordStrong = (password: string) => {
  const strength = getPasswordStrength(password)
  return Object.values(strength).every(Boolean)
}

export function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(""))

  // Update password strength in real-time
  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password))
  }, [password])

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!isPasswordStrong(password)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
      )
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to register")
      }

      router.push("/auth/signin?registered=true")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
      setIsLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-red-500 bg-red-50 rounded">
          <div>{error}</div>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full p-2 border rounded"
        />
        <div className="text-sm space-y-2">
          <p>Password requirements:</p>
          <ul className="space-y-1">
            <li className={`flex items-center gap-2 ${passwordStrength.minLength ? "text-green-600" : "text-gray-500"}`}>
              <span>{passwordStrength.minLength ? "✓" : "○"}</span>
              At least 8 characters
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
              <span>{passwordStrength.hasUpperCase ? "✓" : "○"}</span>
              One uppercase letter
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? "text-green-600" : "text-gray-500"}`}>
              <span>{passwordStrength.hasLowerCase ? "✓" : "○"}</span>
              One lowercase letter
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength.hasNumbers ? "text-green-600" : "text-gray-500"}`}>
              <span>{passwordStrength.hasNumbers ? "✓" : "○"}</span>
              One number
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
              <span>{passwordStrength.hasSpecialChar ? "✓" : "○"}</span>
              One special character (!@#$%^&*)
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full p-2 border rounded"
        />
        {confirmPassword && (
          <div className={`text-sm flex items-center gap-2 ${password === confirmPassword ? "text-green-600" : "text-red-500"}`}>
            <span>{password === confirmPassword ? "✓" : "✗"}</span>
            {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
          </div>
        )}
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed" 
        disabled={isLoading || !isPasswordStrong(password) || password !== confirmPassword}
      >
        {isLoading ? "Creating account..." : "Sign up"}
      </button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}