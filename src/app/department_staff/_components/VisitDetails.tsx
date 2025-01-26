"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Prisma, VisitStatus } from "@prisma/client";

type Status = VisitStatus;

export default function VisitDetails({
  visit,
}: {
  visit: Prisma.VisitGetPayload<{ include: { Beneficiary: true } }>;
}) {
  const [status, setStatus] = useState<Status>(visit.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Here you would typically make an API call to update the status
    console.log(`Status updated to: ${status}`);
    setIsSaving(false);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Visit Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Visit ID</Label>
            <p className="text-sm font-medium">{visit.id}</p>
          </div>
          <div>
            <Label>Beneficiary Name</Label>
            <p className="text-sm font-medium">{visit.Beneficiary.name}</p>
          </div>
          <div>
            <Label>Date</Label>
            <p className="text-sm font-medium">
              {visit.createdAt.toDateString()}
            </p>
          </div>
          <div>
            <Label>Purpose</Label>
            <p className="text-sm font-medium">{visit.purpose}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Status"}
        </Button>
      </CardFooter>
    </Card>
  );
}
