import { SignIn } from "@/components/LoginSignUpCard";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession();
  if (session?.user) {
    return redirect(`/${session?.user?.role?.toLowerCase()}`);
  }

  return (
    <main className="grid h-screen w-full place-content-center">
      <SignIn />
    </main>
  );
}
