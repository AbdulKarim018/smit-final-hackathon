"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: { onSuccess: async () => router.push("/") },
        })
      }
    >
      Logout <LogOutIcon />
    </Button>
  );
}
