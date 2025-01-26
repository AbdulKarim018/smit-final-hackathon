import "server-only";

import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";

export const baseUrl = env.VERCEL_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL: baseUrl,

  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    nextCookies(),
    admin({
      adminRole: "ADMIN",
      defaultRole: "USER",
    }),
  ],
});

export const getServerSession = async () =>
  await auth.api.getSession({ headers: await headers() });
