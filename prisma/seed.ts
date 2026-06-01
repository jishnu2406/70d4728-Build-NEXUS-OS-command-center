import { faker } from "@faker-js/faker";
import { PrismaClient, OrgType, Plan, Role, ProjectType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "foster-partners" },
    update: {},
    create: {
      slug: "foster-partners",
      name: "Foster + Partners Studio",
      type: OrgType.MIXED,
      plan: Plan.ENTERPRISE,
      brandColor: "#6366f1",
      settings: {
        domain: "foster-partners.nexusos.app",
        ssoRequired: true,
        ipAllowlist: [],
      },
      aiConfig: {
        primaryModel: "claude-sonnet-4-20250514",
        fallbackModel: "gpt-4o",
        monthlyBudget: 18000,
      },
    },
  });

  const departments = await Promise.all(
    ["Architecture", "Interiors", "Production", "Brand", "Strategy"].map((name) =>
      prisma.department.upsert({
        where: { organizationId_name: { organizationId: organization.id, name } },
        update: {},
        create: { organizationId: organization.id, name },
      }),
    ),
  );

  const users = await Promise.all(
    Array.from({ length: 12 }).map((_, index) =>
      prisma.user.upsert({
        where: { email: `demo${index + 1}@nexusos.app` },
        update: {},
        create: {
          email: `demo${index + 1}@nexusos.app`,
          name: faker.person.fullName(),
          image: faker.image.avatar(),
          preferences: {
            create: {
              theme: index % 2 === 0 ? "obsidian" : "arctic",
              font: "sf-pro",
              timezone: "Asia/Calcutta",
              currency: "USD",
            },
          },
        },
      }),
    ),
  );

  await Promise.all(
    users.map((user, index) =>
      prisma.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: user.id,
          },
        },
        update: {},
        create: {
          organizationId: organization.id,
          userId: user.id,
          role: index === 0 ? Role.CEO : index < 3 ? Role.DIRECTOR : Role.MEMBER,
          title: faker.person.jobTitle(),
          departmentId: departments[index % departments.length].id,
        },
      }),
    ),
  );

  const client = await prisma.client.upsert({
    where: { portalSlug: "atlas-financial" },
    update: {},
    create: {
      organizationId: organization.id,
      name: "Atlas Financial Group",
      industry: "Financial services",
      portalSlug: "atlas-financial",
      billingEmail: "accounts@atlas.example",
      contacts: {
        create: {
          name: "Marian West",
          email: "marian.west@atlas.example",
          title: "VP Workplace Strategy",
        },
      },
    },
  });

  const project = await prisma.project.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "A-2408",
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      clientId: client.id,
      code: "A-2408",
      name: "Atlas Financial HQ",
      type: ProjectType.ARCHITECTURE_COMMISSION,
      location: "London, UK",
      budget: 4800000,
      spent: 3160000,
      marginTarget: 28,
      phases: {
        create: ["Concept", "Schematic", "Design Dev", "Documentation", "Construction", "Handover"].map(
          (name, order) => ({
            name,
            order,
            status: order < 2 ? "complete" : order === 2 ? "active" : "planned",
          }),
        ),
      },
      milestones: {
        create: [
          {
            name: "Board design review",
            dueAt: faker.date.soon({ days: 18 }),
            requiresClientApproval: true,
          },
          {
            name: "Facade consultant sign-off",
            dueAt: faker.date.soon({ days: 9 }),
          },
        ],
      },
    },
  });

  await prisma.asset.createMany({
    data: [
      {
        organizationId: organization.id,
        projectId: project.id,
        name: "Atlas HQ facade study R12.pdf",
        type: "Drawing",
        status: "REVIEW",
        storageKey: "assets/atlas/facade-r12.pdf",
      },
      {
        organizationId: organization.id,
        projectId: project.id,
        name: "Atlas board minutes May.docx",
        type: "Document",
        status: "APPROVED",
        storageKey: "assets/atlas/board-minutes-may.docx",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.aIAgent.createMany({
    data: ["Budget Guardian", "Deadline Sentinel", "Report Writer", "Knowledge Curator"].map(
      (name) => ({
        organizationId: organization.id,
        name,
        description: `${name} automation for enterprise operations.`,
      }),
    ),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
