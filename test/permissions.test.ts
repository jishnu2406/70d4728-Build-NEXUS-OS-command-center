import { describe, expect, it } from "vitest";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

describe("permission matrix", () => {
  it("gives CEO wildcard access", () => {
    expect(hasPermission("ceo", "billing:manage")).toBe(true);
    expect(hasPermission("ceo", "security:manage")).toBe(true);
  });

  it("honors scoped wildcard permissions", () => {
    expect(hasPermission("director", "projects:create")).toBe(true);
    expect(hasPermission("director", "projects:update")).toBe(true);
  });

  it("keeps financial permissions out of contributor roles", () => {
    expect(hasPermission("member", "financials:view")).toBe(false);
    expect(PERMISSIONS.cfo).toContain("financials:manage");
  });
});
