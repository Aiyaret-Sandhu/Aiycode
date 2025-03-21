import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CodeEditor } from "@/components/code-editor/code-editor"

export default async function CodeRunnerPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user?.emailVerified) {
    redirect("/auth/verify-email-prompt")
  }

  return (
    <div className="container mx-auto py-10">
        <CodeEditor />
    </div>
  )
}