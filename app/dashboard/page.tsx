import { requireAuth } from "@/lib/auth"

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-2">Welcome, {user.name}!</p>
        <p>This is a protected page that only authenticated users can access.</p>
      </div>
    </div>
  )
}

