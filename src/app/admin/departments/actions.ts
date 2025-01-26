"use server";

import { db } from "@/server/db";

export const addDepartment = async ({
  name,
  code,
}: {
  name: string;
  code: string;
}) => {
  console.log("adding department", name, code);
  await db.department.create({
    data: {
      name,
      code,
    },
  });
  return true;
};

export const deleteDepartment = async (id: string) => {
  await db.department.delete({
    where: {
      id,
    },
  });
  return true;
};
