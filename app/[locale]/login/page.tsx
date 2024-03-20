import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { Session } from "next-auth";
import SignOutForm from "@/components/Login/SignOutForm";
import SignInForm from "@/components/Login/SignInForm";

export default async function Login() {
  const session = await getServerSession(authOptions);
  return <GetTranslations session={session} />;
}

// SomeRouteLink.tsx
function GetTranslations({ session }: { session: Session | null }) {
  return (
    <main className="absolute top-0 h-full w-full flex justify-center items-center bg-gradient-to-t from-primary-green-900 ">
      <div className="rounded-lg shadow-lg max-w-[720px] bg-neutral-white">
        <div className="w-full md:w-[720px] flex flex-col justify-center md:flex-row items-center gap-4 p-4 ">
          <Image
            src="/Icon.svg"
            width={320}
            height={320}
            alt="KU Planner Icon"
          />
          <div className="w-full">
            {session != null ? (
              <SignOutForm session={session} />
            ) : (
              <SignInForm />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
