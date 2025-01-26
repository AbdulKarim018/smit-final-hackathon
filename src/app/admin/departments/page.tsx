import { db } from "@/server/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddDepartmentModal from "./_components/add-department-modal";
import DeleteDepartmentModal from "./_components/delete-department-modal";
import { Separator } from "@/components/ui/separator";

export default async function DepartmentsPage() {
  const departments = await db.department.findMany();
  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Departments</h1>
        <AddDepartmentModal />
      </div>
      <Separator className="my-4" />
      <div>
        <Table>
          <TableCaption>Total Departments: {departments.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Current Count</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.code}</TableCell>
                <TableCell>{department.count}</TableCell>
                <TableCell>
                  <DeleteDepartmentModal departmentId={department.id} />
                </TableCell>
              </TableRow>
            ))}
            {/* <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
