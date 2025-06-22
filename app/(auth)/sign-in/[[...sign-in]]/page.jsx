import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className="grid w-full min-h-screen flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
        <SignIn />
      </div>
}