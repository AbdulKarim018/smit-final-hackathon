"use server";

import { db } from "@/server/db";
import { Department, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  await db.user.delete({
    where: {
      id,
    },
  });
  revalidatePath("/admin/users");
  return true;
};

export const assignUserToDepartment = async ({
  userId,
  departmentId,
}: {
  userId: string;
  departmentId: string;
}) => {
  console.log("assigning user to department", userId, departmentId);
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      departmentId,
    },
  });
  return true;
};
