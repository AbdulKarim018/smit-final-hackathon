import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Department, UserRole } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { assignUserToDepartment } from "../actions";

interface AddUserModalProps {
  departments: Department[];
}

export function AddUserModal({ departments }: AddUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }>({
    name: "",
    email: "",
    password: "",
    role: "DEPARTMENT_STAFF",
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setNewUser((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      data: {
        ...(newUser.role === "DEPARTMENT_STAFF" && {
          departmentId: departments.find((d) => d.name === departmentName)?.id,
        }),
      },
    });
    const { data } = await authClient.admin.createUser(
      {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
      {
        onSuccess: async (ctx) => {
          setIsOpen(false);
          setNewUser({
            name: "",
            email: "",
            password: "",
            role: "DEPARTMENT_STAFF",
          });
          const user = ctx.data?.user;
          user?.role === "DEPARTMENT_STAFF" &&
            (await assignUserToDepartment({
              userId: user?.id,
              departmentId:
                departments.find((d) => d.name === departmentName)?.id ?? "",
            }));
          router.refresh();
          toast.success("User created successfully");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
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
                required
                value={newUser.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={newUser.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                required
                value={newUser.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={newUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem value={role} key={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newUser.role === "DEPARTMENT_STAFF" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={departmentName}
                    onValueChange={(v) => setDepartmentName(v)}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem value={department.name} key={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" isLoading={isLoading}>
              Add User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
