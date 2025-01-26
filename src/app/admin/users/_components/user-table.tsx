"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { EditUserModal } from "./edit-user-modal";
import { DeleteUserModal } from "./delete-user-modal";
import { AddUserModal } from "./add-user-modal";
import { UserStats } from "./user-stats";
import { Department, Prisma, User } from "@prisma/client";

export default function UserTable({
  users,
  departments,
}: {
  users: Prisma.UserGetPayload<{ include: { Department: true } }>[];
  departments: Department[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <div className="mb-6">
        <UserStats users={users} />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Search by Name or Role"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />

        <AddUserModal departments={departments} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Eaail</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.Department?.name}</TableCell>
              <TableCell>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => handleEdit(user)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button> */}
                <DeleteUserModal id={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEdit}
      /> */}
    </div>
  );
}
