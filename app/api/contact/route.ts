import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { isEmailConfigured, sendContactEmail } from "@/lib/email/transporter";

const contactPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  message: z.string().min(20),
});

const SUCCESS_MESSAGE = "Thank you for reaching out!";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const payload = contactPayloadSchema.parse(body);

    console.info("[contact:submission]", {
      timestamp: new Date().toISOString(),
      ...payload,
    });

    const emailReady = isEmailConfigured();

    if (!emailReady) {
      console.info("[contact:pipeline] skipped", {
        emailReady,
      });

      return NextResponse.json(
        {
          success: true,
          message: SUCCESS_MESSAGE,
        },
        { status: 200 },
      );
    }

    try {
      const submissionMeta = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };

      await sendContactEmail({
        ...payload,
        submission: {
          name: payload.name,
          email: payload.email,
          ...submissionMeta,
        },
      }).catch((emailError) => {
        const message =
          emailError instanceof Error ? emailError.message : String(emailError);
        throw new Error(`Email dispatch failed: ${message}`);
      });

      console.info("[contact:pipeline] completed", {
        submissionId: submissionMeta.id,
        createdAt: submissionMeta.createdAt,
      });

      return NextResponse.json(
        {
          success: true,
          message: SUCCESS_MESSAGE,
          submissionId: submissionMeta.id,
        },
        { status: 200 },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error("[contact:pipeline:error]", message, {
        emailReady,
      });

      if (/email/i.test(message) || /resend/i.test(message)) {
        return NextResponse.json(
          {
            success: false,
            message: "Contact email dispatch failed. Please try again later.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong while sending your message.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("[contact:submission:error]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending your message.",
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    {
      status: "ready",
      message: "Submit a POST request to send contact form data.",
    },
    { status: 200 },
  );
}
