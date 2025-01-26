"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { addDepartment } from "../actions";
import { toast } from "sonner";

export default function AddDepartmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDepartment, setNewDepartment] = useState<{
    name: string;
    code: string;
  }>({
    name: "",
    code: "",
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("new department", newDepartment);
    try {
      await addDepartment({
        name: newDepartment.name,
        code: newDepartment.code,
      });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the department");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Department</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create a new department.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="eg. Medical"
                required
                className="col-span-3"
                value={newDepartment.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                placeholder="eg. MED"
                required
                className="col-span-3"
                value={newDepartment.code}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Add Department
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
