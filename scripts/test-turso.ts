import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function test() {
  console.log(
    "🔗 Connecting to Turso:",
    process.env.TURSO_DATABASE_URL?.substring(0, 40),
  );

  const profile = await prisma.profile.findFirst();
  console.log("Profile:", profile?.name || "NOT FOUND");

  const certs = await prisma.certification.count();
  console.log("Certifications:", certs);

  const skills = await prisma.skill.count();
  console.log("Skills:", skills);

  const projects = await prisma.project.count();
  console.log("Projects:", projects);
}

test()
  .catch(console.error)
  .finally(() => {
    void prisma.$disconnect();
  });
