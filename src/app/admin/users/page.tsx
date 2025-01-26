import React from "react";
import UserTable from "./_components/user-table";
import { db } from "@/server/db";
import { auth } from "@/lib/auth";

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      Department: true,
    },
  });
  console.log(users);
  const departments = await db.department.findMany();
  return <UserTable users={users} departments={departments} />;
}
