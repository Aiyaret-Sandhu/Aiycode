import { SignInForm } from "@/components/auth/sign-in-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await getSession()

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    // Redirect to email verification prompt if the user is not verified
    if (!user?.emailVerified) {
      redirect("/auth/verify-email-prompt")
      return null
    }

    // Redirect to dashboard if the user is verified
    redirect("/dashboard")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight">Sign in to your account</h1>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}

