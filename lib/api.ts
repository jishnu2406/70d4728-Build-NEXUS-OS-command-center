import { NextResponse } from "next/server";
import { z } from "zod";
import { activeSession, hasPermission } from "@/lib/permissions";

export type ApiEnvelope<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
  meta: {
    orgId: string;
    requestId: string;
    timestamp: string;
  };
};

export function envelope<T>(
  data: T | null,
  error?: { code: string; message: string } | null,
  init?: ResponseInit,
) {
  const body: ApiEnvelope<T> = {
    data,
    error: error ?? null,
    meta: {
      orgId: activeSession.orgId,
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(body, init);
}

export function requirePermission(permission: string) {
  if (!hasPermission(activeSession.role, permission)) {
    return envelope(null, { code: "FORBIDDEN", message: "Insufficient permissions." }, { status: 403 });
  }

  return null;
}

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});
