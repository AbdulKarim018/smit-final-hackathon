"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteDepartment } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteDepartmentModal({
  departmentId,
}: {
  departmentId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this department? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              setIsLoading(true);
              try {
                await deleteDepartment(departmentId);
                router.refresh();
              } catch (error) {
                toast.error("An error occurred while deleting the department");
                console.log("error deleting department", error);
              } finally {
                setIsLoading(false);
              }
            }}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
