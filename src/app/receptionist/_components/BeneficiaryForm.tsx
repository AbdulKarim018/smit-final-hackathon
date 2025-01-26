"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  convertImageToBase64,
  imageUrlToBase64,
  uploadImageToCloudinary,
} from "@/lib/utils";
import { Beneficiary, Department } from "@prisma/client";
import { jsPDF } from "jspdf";
import Image from "next/image";
import QRCode from "qrcode";
import React, { useState } from "react";
import { createBeneficiaryAndVisit } from "../actions";

const SAYLANI_LOGO_URL = "/saylani-logo.png";

interface BeneficiaryFormProps {
  departments: Department[];
}

export default function BeneficiaryForm({ departments }: BeneficiaryFormProps) {
  const [beneficiary, setBeneficiary] = useState<
    Omit<Beneficiary, "id"> & { departmentId: string; purpose: string }
  >({
    name: "",
    address: "",
    phone: "",
    email: "",
    cnic: "",
    purpose: "",
    cnicFrontPicture: "",
    cnicBackPicture: "",
    departmentId: "",
  });
  const [cnicFrontPreview, setCnicFrontPreview] = useState<string | null>(null);
  const [cnicBackPreview, setCnicBackPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { visitToken } = await createBeneficiaryAndVisit({
      name: beneficiary.name,
      address: beneficiary.address,
      phone: beneficiary.phone,
      email: beneficiary.email,
      cnic: beneficiary.cnic,
      purpose: beneficiary.purpose,
      cnicFrontPicture: beneficiary.cnicFrontPicture,
      cnicBackPicture: beneficiary.cnicBackPicture,
      departmentId: beneficiary.departmentId,
    });

    const imageDataURL = (await imageUrlToBase64(SAYLANI_LOGO_URL)) as string;
    generatePDF(imageDataURL, visitToken);
    setIsLoading(false);
    setBeneficiary({
      name: "",
      address: "",
      phone: "",
      email: "",
      cnic: "",
      purpose: "",
      cnicFrontPicture: "",
      cnicBackPicture: "",
      departmentId: "",
    });
    setCnicFrontPreview(null);
    setCnicBackPreview(null);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">Add Beneficiary</h2>
          </CardHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              required
              className="col-span-3"
              value={beneficiary.name}
              onChange={(e) =>
                setBeneficiary((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              type="text"
              required
              className="col-span-3"
              value={beneficiary.phone}
              onChange={(e) =>
                setBeneficiary((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              required
              className="col-span-3"
              value={beneficiary.address}
              onChange={(e) =>
                setBeneficiary((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="col-span-3"
              value={beneficiary.email}
              onChange={(e) =>
                setBeneficiary((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cnic" className="text-right">
              CNIC
            </Label>
            <Input
              id="cnic"
              type="text"
              required
              placeholder="XXXXX-XXXXXXX-X"
              pattern="^\d{5}-\d{7}-\d{1}$"
              className="col-span-3"
              value={beneficiary.cnic}
              onChange={(e) =>
                setBeneficiary((prev) => ({ ...prev, cnic: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="departmentId" className="text-right">
              Department Name
            </Label>
            <Select
              onValueChange={(v) =>
                setBeneficiary((prev) => ({ ...prev, departmentId: v }))
              }
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.map((department) => (
                    <SelectItem value={department.id} key={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              Purpose
            </Label>
            <Textarea
              id="purpose"
              required
              placeholder="Visit Details"
              className="col-span-3"
              value={beneficiary.purpose}
              onChange={(e) =>
                setBeneficiary((prev) => ({ ...prev, purpose: e.target.value }))
              }
            ></Textarea>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cnicFrontPicture" className="text-right">
              CNIC Front Picture
            </Label>
            <Input
              id="cnicFrontPicture"
              type="file"
              accept="image/*"
              className="col-span-3"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                setCnicFrontPreview(
                  file ? await convertImageToBase64(file) : null,
                );
                const url = file ? await uploadImageToCloudinary(file) : "";
                setBeneficiary((prev) => ({
                  ...prev,
                  cnicFrontPicture: url,
                }));
              }}
            />
            {cnicFrontPreview && (
              <Image
                src={cnicFrontPreview}
                alt="CNIC Front Picture"
                width={48}
                height={48}
                className="h-48 w-full rounded-sm object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cnicBackPicture" className="text-right">
              CNIC Back Picture
            </Label>
            <Input
              id="cnicBackPicture"
              type="file"
              accept="image/*"
              className="col-span-3"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                setCnicBackPreview(
                  file ? await convertImageToBase64(file) : null,
                );
                const url = file ? await uploadImageToCloudinary(file) : "";
                setBeneficiary((prev) => {
                  return {
                    ...prev,
                    cnicBackPicture: url,
                  };
                });
              }}
            />
            {cnicBackPreview && (
              <Image
                src={cnicBackPreview}
                alt="CNIC Back Picture"
                className="h-48 w-full rounded-sm object-cover"
                width={48}
                height={48}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

async function generatePDF(imageDataURL: string, token: string) {
  const doc = new jsPDF();

  // Add header image
  const headerHeight = 20; // Adjust as needed
  const headerWidth = 50; // Adjust as needed
  doc.addImage(imageDataURL, "PNG", 10, 10, headerWidth, headerHeight);

  // Add token text
  doc.setFontSize(12);
  doc.text("Token:", 10, 40);
  doc.setFontSize(16);
  doc.text(token, 10, 50);

  // Generate QR code and add to the PDF
  try {
    const qrCodeDataURL = await QRCode.toDataURL(token, {
      errorCorrectionLevel: "H",
    });
    const qrCodeSize = 50; // Adjust as needed
    doc.addImage(qrCodeDataURL, "PNG", 10, 60, qrCodeSize, qrCodeSize);
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  // Add footer with current time
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const currentTime = new Date().toLocaleString();

  doc.setFontSize(10);
  doc.text(currentTime, pageWidth / 2, pageHeight - 10, { align: "center" });

  // Save the PDF
  doc.save(`${token}.pdf`);
}
