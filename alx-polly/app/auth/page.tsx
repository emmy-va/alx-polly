import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
