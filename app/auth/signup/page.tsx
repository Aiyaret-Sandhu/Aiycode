import { SignUpForm } from "@/components/auth/sign-up-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function SignUpPage() {
  const session = await getSession()

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.emailVerified) {
      redirect("/auth/verify-email-prompt")
    } else {
      redirect("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight">Create a new account</h1>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}

