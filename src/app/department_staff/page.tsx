import SignedIn from "@/components/SignedIn";
import React from "react";
import LogoutButton from "../receptionist/_components/LogoutButton";
import { getServerSession } from "@/lib/auth";
import { db } from "@/server/db";
import VisitsTable from "./_components/VisitsTable";

export default async function DepartmentStaffPage() {
  const session = await getServerSession();

  const user = await db.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    include: {
      Department: true,
    },
  });

  const visits = await db.visit.findMany({
    where: {
      token: {
        startsWith: user?.Department?.code,
      },
    },
    include: {
      Beneficiary: true,
    },
  });

  console.log(visits);

  return (
    <SignedIn>
      <div>
        <header className="bg-gray-200 p-2">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <span></span>
            <h1>
              {user?.name} [{user?.role}] Department: {user?.Department?.name}
            </h1>
            <LogoutButton />
          </div>
        </header>
        <div>
          <VisitsTable visits={visits} />
        </div>
      </div>
    </SignedIn>
  );
}
