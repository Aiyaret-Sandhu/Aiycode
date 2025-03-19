"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Link from "next/link"

export function AuthStatus() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return <div className="text-sm">Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/signin">
          <button>
            Sign in
          </button>
        </Link>
        <Link href="/auth/signup">
          <button>Sign up</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">{session.user?.name || session.user?.email}</span>
      <button onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </button>
    </div>
  )
}

