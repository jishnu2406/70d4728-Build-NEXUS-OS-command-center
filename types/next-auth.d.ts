import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    orgId: string;
    role: string;
    permissions: string[];
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    orgId?: string;
    role?: string;
    permissions?: string[];
  }
}
