import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn path="/login" routing="path" signUpUrl="/register" fallbackRedirectUrl="/dashboard" />
    </div>
  );
}