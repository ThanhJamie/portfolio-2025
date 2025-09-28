const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type ContactEmailPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  submission?: {
    id?: string;
    createdAt?: string;
    name?: string;
    email?: string;
  };
};

export type EmailDispatchResult = {
  id: string;
  status: "queued" | "sent";
};

type ResendConfig = {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
};

const resolveResendConfig = (): ResendConfig => {
  const {
    RESEND_API_KEY,
    CONTACT_FROM_ADDRESS,
    CONTACT_TO_ADDRESS,
    CONTACT_NOTIFICATION_SUBJECT,
  } = process.env;

  const missingEnv: string[] = [];

  if (!RESEND_API_KEY) {
    missingEnv.push("RESEND_API_KEY");
  }

  if (!CONTACT_FROM_ADDRESS) {
    missingEnv.push("CONTACT_FROM_ADDRESS");
  }

  if (!CONTACT_TO_ADDRESS) {
    missingEnv.push("CONTACT_TO_ADDRESS");
  }

  if (missingEnv.length > 0) {
    throw new Error(
      `Email configuration missing required environment variables: ${missingEnv.join(", ")}`,
    );
  }

  const subject =
    CONTACT_NOTIFICATION_SUBJECT?.trim() || "New portfolio contact submission";

  return {
    apiKey: RESEND_API_KEY!,
    from: CONTACT_FROM_ADDRESS!,
    to: CONTACT_TO_ADDRESS!,
    subject,
  };
};

export const isEmailConfigured = (): boolean => {
  try {
    resolveResendConfig();
    return true;
  } catch {
    return false;
  }
};

const renderTextBody = (payload: ContactEmailPayload): string => {
  const lines = [
    "New contact submission received.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.submission?.id ? `Submission ID: ${payload.submission.id}` : null,
    payload.submission?.createdAt ? `Created At: ${payload.submission.createdAt}` : null,
    "",
    "Message:",
    payload.message,
  ].filter((line): line is string => Boolean(line));

  return lines.join("\n");
};

export async function sendContactEmail(
  payload: ContactEmailPayload,
): Promise<EmailDispatchResult> {
  const config = resolveResendConfig();

  if (typeof fetch !== "function") {
    throw new Error("Email dispatch failed: fetch is not available in this environment.");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: config.subject,
      reply_to: payload.email,
      text: renderTextBody(payload),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    const suffix = details ? ` - ${details}` : "";
    throw new Error(
      `Email dispatch failed: ${response.status} ${response.statusText}${suffix}`,
    );
  }

  const result = (await response.json()) as { id?: string; status?: string };

  return {
    id: typeof result.id === "string" ? result.id : "unknown",
    status: result.status === "sent" ? "sent" : "queued",
  };
}
