"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  Calendar,
  GridIcon,
  HomeIcon,
  InboxIcon,
  LogOutIcon,
  PieChart,
  SearchIcon,
  Settings,
  UsersIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import SignedIn from "./SignedIn";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "",
    icon: PieChart,
  },
  {
    title: "Users",
    url: "/users",
    icon: UsersIcon,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: GridIcon,
  },
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: SearchIcon,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
];

export default function AdminSidebar() {
  const { data: session, isPending } = authClient.useSession();
  // console.log("session", session);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <SignedIn>
      <Sidebar>
        <SidebarHeader className="text-center text-lg font-bold">
          {session?.user?.name} [{session?.user?.role}]
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel>{session?.user?.name}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/admin/${item.url}`}
                        className={`rounded-md ${pathname === `/admin${item.url}` ? "bg-gray-300 hover:bg-gray-300" : ""}`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button
            onClick={async () =>
              await authClient.signOut({
                fetchOptions: { onSuccess: async () => router.push("/") },
              })
            }
          >
            Logout <LogOutIcon />
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SignedIn>
  );
}
