import { NextResponse, type NextRequest } from "next/server";
import { activeSession } from "@/lib/permissions";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nexus-org-id", activeSession.orgId);
  requestHeaders.set("x-nexus-role", activeSession.role);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-nexus-tenant", activeSession.orgSlug);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
