import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function RedirectPage() {
  const session = await getServerSession();

  if (session?.user) {
    return redirect(`/${session?.user?.role?.toLowerCase()}`);
  }

  return <div>RedirectPage</div>;
}
