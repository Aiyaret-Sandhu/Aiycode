import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user?.emailVerified) {
    redirect("/auth/verify-email-prompt")
    return null
  }

  if (!user || !user.emailVerified) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-2">Welcome, {user.name}!</p>
        <p>This is a protected page that only authenticated and verified users can access.</p>
      </div>

      <Link 
        href="/dashboard/code-runner"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Open Code Runner
      </Link>

      <Link 
        href="/dashboard/readme-previewer"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Open Readme Previewer
      </Link>
    </div>
  )
}