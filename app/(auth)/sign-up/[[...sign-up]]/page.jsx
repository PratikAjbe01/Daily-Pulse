// app/sign-up/page.jsx (or .tsx)
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    // Reusing the centering styles from your SignInPage component
    <div className="grid w-full min-h-screen flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <SignUp />
    </div>
  );
}