import { envelope, requirePermission } from "@/lib/api";
import { notifications } from "@/lib/data";

export async function GET() {
  const forbidden = requirePermission("projects:view");
  if (forbidden) return forbidden;

  return envelope({
    items: notifications.map((message, index) => ({
      id: `ntf_${index + 1}`,
      message,
      read: index > 1,
      createdAt: new Date(Date.now() - index * 1000 * 60 * 18).toISOString(),
    })),
  });
}
