import { db } from "@/server/db";
import React from "react";
import VisitDetails from "../_components/VisitDetails";

export default async function VisitPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const visit = await db.visit.findUnique({
    where: {
      id,
    },
    include: {
      Beneficiary: true,
    },
  });
  if (!visit) {
    return <div>Visit not found</div>;
  }
  return (
    <div>
      <VisitDetails visit={visit} />
    </div>
  );
}
