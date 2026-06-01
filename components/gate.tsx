import { activeSession, hasPermission } from "@/lib/permissions";
import type { Role } from "@/lib/types";

export function Gate({
  permission,
  role = activeSession.role,
  fallback = null,
  children,
}: {
  permission: string;
  role?: Role;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  return hasPermission(role, permission) ? <>{children}</> : <>{fallback}</>;
}
