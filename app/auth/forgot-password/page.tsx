import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {

  return (

    <div className="mx-auto max-w-md space-y-6">

      <div className="space-y-2 text-center">

        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <p className="text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
        </p>

      </div>

      <ForgotPasswordForm />

    </div>
  );
}
