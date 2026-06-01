-- Supabase/PostgreSQL row-level security sketch for NEXUS OS.
-- The application also scopes every Prisma query by organizationId.

alter table "Organization" enable row level security;
alter table "Project" enable row level security;
alter table "Asset" enable row level security;
alter table "Invoice" enable row level security;
alter table "AuditLog" enable row level security;

create policy tenant_members_can_read_projects on "Project"
  for select using (
    "organizationId" = current_setting('app.current_org_id', true)
  );

create policy tenant_members_can_read_assets on "Asset"
  for select using (
    "organizationId" = current_setting('app.current_org_id', true)
  );

create policy finance_roles_can_read_invoices on "Invoice"
  for select using (
    "organizationId" = current_setting('app.current_org_id', true)
    and current_setting('app.current_permissions', true) like '%financials:view%'
  );
