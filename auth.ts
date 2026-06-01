import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Resend from "next-auth/providers/resend";
import { activeSession } from "@/lib/permissions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google,
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_ENTRA_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_ENTRA_CLIENT_SECRET,
      issuer: process.env.MICROSOFT_ENTRA_TENANT_ID
        ? `https://login.microsoftonline.com/${process.env.MICROSOFT_ENTRA_TENANT_ID}/v2.0`
        : undefined,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "NEXUS OS <login@nexusos.app>",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token }) {
      token.orgId = activeSession.orgId;
      token.role = activeSession.role;
      token.permissions = activeSession.permissions;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? activeSession.userId;
      session.orgId = String(token.orgId);
      session.role = String(token.role);
      session.permissions = Array.isArray(token.permissions) ? token.permissions : [];
      return session;
    },
  },
});
