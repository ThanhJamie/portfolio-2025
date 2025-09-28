type EnvVarRequirement = {
  name: string;
  description: string;
  optional?: boolean;
  scope: "server" | "client";
};

interface RequirementGroup {
  service: string;
  docsUrl?: string;
  variables: EnvVarRequirement[];
}

const requirementGroups: RequirementGroup[] = [
  {
    service: "Resend",
    docsUrl: "https://resend.com/docs/api-reference",
    variables: [
      {
        name: "RESEND_API_KEY",
        description: "Resend API key with email sending permissions",
        scope: "server",
      },
      {
        name: "CONTACT_FROM_ADDRESS",
        description:
          'Verified sender email (e.g. "Portfolio Bot <no-reply@example.com>")',
        scope: "server",
      },
      {
        name: "CONTACT_TO_ADDRESS",
        description: "Destination inbox for new contact submissions",
        scope: "server",
      },
      {
        name: "CONTACT_NOTIFICATION_SUBJECT",
        description: "Optional custom subject line for contact notifications",
        scope: "server",
        optional: true,
      },
    ],
  },
];

const pad = (value: string, length: number): string => value.padEnd(length, " ");

function hasValue(name: string): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === null) {
    return false;
  }

  return raw.toString().trim().length > 0;
}

function logGroup(group: RequirementGroup, missing: string[]): void {
  const header = group.docsUrl ? `${group.service} (${group.docsUrl})` : group.service;
  console.log(`\n=== ${header} ===`);

  group.variables.forEach((variable) => {
    const valuePresent = hasValue(variable.name);
    const label = `${pad(variable.name, 32)} [${variable.scope}] - ${variable.description}`;

    if (valuePresent) {
      console.log(`✅ ${label}`);
      return;
    }

    if (variable.optional) {
      console.log(`⚠️  ${label} (optional)`);
      return;
    }

    console.error(`❌ ${label}`);
    missing.push(variable.name);
  });
}

function run(): void {
  console.log("🔍 Validating required deployment environment variables\n");

  const missingVariables: string[] = [];

  requirementGroups.forEach((group) => logGroup(group, missingVariables));

  if (missingVariables.length > 0) {
    console.error(`\n❗ Missing required variables: ${missingVariables.join(", ")}`);
    console.error(
      "Ensure these values are set in Vercel (production, preview, and development environments) before deploying.",
    );
    process.exitCode = 1;
    return;
  }

  console.log("\n🎉 All required deployment variables are present.");
}

try {
  run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Unexpected error while validating environment configuration:");
  console.error(message);
  process.exitCode = 1;
}
