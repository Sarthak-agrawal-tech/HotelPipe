import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp path="/register" routing="path" signInUrl="/login" fallbackRedirectUrl="/dashboard" />
    </div>
  );
}