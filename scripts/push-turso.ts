/**
 * Push schema to Turso database
 * This script creates tables directly via LibSQL since Prisma CLI doesn't support libsql:// scheme
 *
 * Usage: npx tsx scripts/push-turso.ts
 */

import { createClient } from "@libsql/client";
import "dotenv/config";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoAuthToken) {
  console.error("❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

console.log("🚀 Connecting to Turso:", tursoUrl);

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

// SQLite schema matching Prisma schema
const schema = `
-- Profile
CREATE TABLE IF NOT EXISTS Profile (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL DEFAULT '',
  availability TEXT NOT NULL DEFAULT '',
  avatarUrl TEXT,
  summary TEXT NOT NULL DEFAULT '',
  linkedinUrl TEXT,
  githubUrl TEXT,
  websiteUrl TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Experience
CREATE TABLE IF NOT EXISTS Experience (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  startDate DATETIME NOT NULL,
  endDate DATETIME,
  isCurrent INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  highlights TEXT NOT NULL DEFAULT '[]',
  employmentType TEXT NOT NULL DEFAULT 'Full-time',
  companyUrl TEXT,
  logoUrl TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE IF NOT EXISTS Education (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL DEFAULT '',
  location TEXT,
  startDate DATETIME NOT NULL,
  endDate DATETIME,
  isCurrent INTEGER NOT NULL DEFAULT 0,
  gpa TEXT,
  description TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Skill
CREATE TABLE IF NOT EXISTS Skill (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 3,
  icon TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Project
CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  problem TEXT,
  approach TEXT NOT NULL DEFAULT '[]',
  role TEXT,
  liveUrl TEXT,
  githubUrl TEXT,
  caseStudyUrl TEXT,
  thumbnailUrl TEXT,
  heroImageUrl TEXT,
  gallery TEXT NOT NULL DEFAULT '[]',
  techStack TEXT NOT NULL DEFAULT '[]',
  outcomes TEXT NOT NULL DEFAULT '[]',
  category TEXT NOT NULL DEFAULT 'Web Development',
  tags TEXT NOT NULL DEFAULT '[]',
  client TEXT,
  timeline TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  publishedAt DATETIME,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Certification
CREATE TABLE IF NOT EXISTS Certification (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issueDate DATETIME NOT NULL,
  expiryDate DATETIME,
  credentialId TEXT,
  credentialUrl TEXT,
  description TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FocusArea
CREATE TABLE IF NOT EXISTS FocusArea (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SiteSettings
CREATE TABLE IF NOT EXISTS SiteSettings (
  id TEXT PRIMARY KEY,
  servicesEnabled INTEGER NOT NULL DEFAULT 1,
  blogEnabled INTEGER NOT NULL DEFAULT 0,
  testimonialsEnabled INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Testimonial
CREATE TABLE IF NOT EXISTS Testimonial (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  personName TEXT NOT NULL,
  personTitle TEXT NOT NULL,
  company TEXT NOT NULL,
  avatarUrl TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CompanyLogo
CREATE TABLE IF NOT EXISTS CompanyLogo (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  altText TEXT,
  websiteUrl TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Metric
CREATE TABLE IF NOT EXISTS Metric (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TechStackItem
CREATE TABLE IF NOT EXISTS TechStackItem (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  icon TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- HeroStat
CREATE TABLE IF NOT EXISTS HeroStat (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RecentWin
CREATE TABLE IF NOT EXISTS RecentWin (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SocialLink
CREATE TABLE IF NOT EXISTS SocialLink (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isVisible INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log("📦 Creating tables...");

  // Split and execute each statement
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    try {
      await client.execute(statement);
      // Extract table name from CREATE TABLE statement
      const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
      if (match) {
        console.log(`  ✓ ${match[1]}`);
      }
    } catch (error) {
      console.error(`  ✗ Error:`, error);
    }
  }

  console.log("\n✅ Schema pushed to Turso successfully!");
}

main()
  .catch(console.error)
  .finally(() => client.close());
