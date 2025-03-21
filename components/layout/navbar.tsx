import Link from "next/link"
import { AuthStatus } from "@/components/auth/auth-status"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          Aiycode
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
        </nav>
        <AuthStatus />
      </div>
    </header>
  )
}

