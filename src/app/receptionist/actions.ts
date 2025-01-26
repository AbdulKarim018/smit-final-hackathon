"use server";

import { db } from "@/server/db";
import { Beneficiary } from "@prisma/client";

const TOKEN_MAX_LENGTH = 4;

export const createBeneficiaryAndVisit = async ({
  name,
  address,
  phone,
  email,
  cnic,
  purpose,
  cnicFrontPicture,
  cnicBackPicture,
  departmentId,
}: {
  name: string;
  address: string;
  phone: string;
  email: string;
  cnic: string;
  purpose: string;
  cnicFrontPicture: string;
  cnicBackPicture: string;
  departmentId: string;
}) => {
  console.log("adding beneficiary", {
    name,
    address,
    phone,
    email,
    cnic,
    purpose,
    cnicFrontPicture,
    cnicBackPicture,
    departmentId,
  });

  const existingBeneficiary = await db.beneficiary.findUnique({
    where: {
      cnic,
    },
  });

  const department = await db.department.update({
    where: {
      id: departmentId,
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });
  const token = `${department?.code}-${(department.count + "").padStart(TOKEN_MAX_LENGTH, "0")}`;

  if (existingBeneficiary) {
    console.log("found existing beneficiary");

    const newVisit = await db.visit.create({
      data: {
        token,
        purpose,
        beneficiaryId: existingBeneficiary.id,
      },
    });
    return {
      success: true,
      visitId: newVisit.id,
      visitToken: newVisit.token,
    };
  }

  const newBeneficiary = await db.beneficiary.create({
    data: {
      name,
      address,
      phone,
      email,
      cnic,
      cnicFrontPicture,
      cnicBackPicture,
    },
  });

  const newVisit = await db.visit.create({
    data: {
      token,
      purpose,
      beneficiaryId: newBeneficiary.id,
    },
  });

  return {
    success: true,
    visitId: newVisit.id,
    visitToken: newVisit.token,
  };
};
