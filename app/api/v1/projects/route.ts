import { z } from "zod";
import { envelope, paginationSchema, requirePermission } from "@/lib/api";
import { projects } from "@/lib/data";

const projectCreateSchema = z.object({
  name: z.string().min(2),
  client: z.string().min(2),
  type: z.string().min(2),
  location: z.string().min(2),
  budget: z.number().positive(),
});

export async function GET(request: Request) {
  const forbidden = requirePermission("projects:view");
  if (forbidden) return forbidden;

  const url = new URL(request.url);
  const pagination = paginationSchema.parse({
    cursor: url.searchParams.get("cursor") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  return envelope({
    items: projects.slice(0, pagination.limit),
    pageInfo: {
      nextCursor: projects.length > pagination.limit ? projects[pagination.limit]?.id : null,
      hasNextPage: projects.length > pagination.limit,
    },
  });
}

export async function POST(request: Request) {
  const forbidden = requirePermission("projects:create");
  if (forbidden) return forbidden;

  const json = await request.json();
  const parsed = projectCreateSchema.safeParse(json);

  if (!parsed.success) {
    return envelope(
      null,
      {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues.map((issue) => issue.message).join(", "),
      },
      { status: 422 },
    );
  }

  return envelope(
    {
      id: `prj_${crypto.randomUUID()}`,
      orgId: "org_foster_partners",
      ...parsed.data,
      phase: "Concept",
      status: "On Track",
      completion: 0,
    },
    null,
    { status: 201 },
  );
}
