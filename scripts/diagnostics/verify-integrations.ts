import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";

interface CheckResult {
  service: string;
  ok: boolean;
  details: string;
}

const formatHeading = (label: string): string => `\n=== ${label} ===`;

const loadEnvironment = (): void => {
  const envFilePath = resolve(process.cwd(), ".env.local");

  if (existsSync(envFilePath)) {
    loadEnv({ path: envFilePath, override: false });
    return;
  }

  loadEnv();
};

async function checkResend(): Promise<CheckResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.CONTACT_FROM_ADDRESS?.trim();
  const toAddress = process.env.CONTACT_TO_ADDRESS?.trim();

  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");
  if (!fromAddress) missing.push("CONTACT_FROM_ADDRESS");
  if (!toAddress) missing.push("CONTACT_TO_ADDRESS");

  if (missing.length > 0) {
    return {
      service: "Resend",
      ok: false,
      details: `Missing required variables: ${missing.join(", ")}.`,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/domains", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const suffix = body ? ` - ${body}` : "";
      return {
        service: "Resend",
        ok: false,
        details: `HTTP ${response.status} ${response.statusText}${suffix}`,
      };
    }

    const payload = (await response.json()) as {
      data?: Array<{ id?: string; name?: string }>;
    };
    const domainCount = Array.isArray(payload.data) ? payload.data.length : 0;

    return {
      service: "Resend",
      ok: true,
      details: `API key accepted (domains accessible: ${domainCount}). From=${fromAddress}, To=${toAddress}.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      service: "Resend",
      ok: false,
      details: `Unexpected error: ${message}`,
    };
  }
}

async function main(): Promise<void> {
  loadEnvironment();

  const results = await Promise.all([checkResend()]);

  let hasFailures = false;

  results.forEach((result) => {
    const status = result.ok ? "✅" : "❌";
    console.log(formatHeading(result.service));
    console.log(`${status} ${result.details}`);
    if (!result.ok) {
      hasFailures = true;
    }
  });

  if (hasFailures) {
    process.exitCode = 1;
  } else {
    console.log("\n🎉 All integrations responded successfully.");
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Integration diagnostics failed:", message);
  process.exitCode = 1;
});
