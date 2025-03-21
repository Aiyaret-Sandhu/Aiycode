import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {

  return (

    <div className="mx-auto max-w-md space-y-6">

      <div className="space-y-2 text-center">

        <h1 className="text-2xl font-bold">
          Reset Password
        </h1>
        
        <p className="text-gray-500">
          Please enter your new password below.
        </p>

      </div>

      <ResetPasswordForm />
      
    </div>
  )
}