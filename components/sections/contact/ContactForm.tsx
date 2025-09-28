"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { z } from "zod";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  company: z.string().max(120).optional(),
  message: z.string().min(20, "Message should be at least 20 characters"),
});

type ContactFormPayload = z.infer<typeof contactSchema>;
type ContactFormErrors = Partial<Record<keyof ContactFormPayload, string>>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const initialValues: ContactFormPayload = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormPayload>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const isSubmitting = status === "submitting";

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const handleFieldChange =
    <Field extends keyof ContactFormPayload>(field: Field) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage("");

    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const nextErrors: ContactFormErrors = {};

      (Object.keys(fieldErrors) as Array<keyof ContactFormPayload>).forEach((key) => {
        const [message] = fieldErrors[key] ?? [];
        if (message) {
          nextErrors[key] = message;
        }
      });

      setErrors(nextErrors);
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");

      console.info("[contact:client] submitting contact form", {
        timestamp: new Date().toISOString(),
        ...parsed.data,
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        type ErrorResponse = { message?: string };
        let payload: ErrorResponse | null = null;

        try {
          payload = (await response.json()) as ErrorResponse;
        } catch {
          payload = null;
        }

        const message = payload?.message ?? "Unable to submit message";
        throw new Error(message);
      }

      setStatus("success");
      console.info("[contact:client] contact submission acknowledged", {
        status: response.status,
        ...parsed.data,
      });
      setServerMessage("Thanks for reaching out! I’ll get back to you shortly.");
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      console.error("Contact form submission failed", error);
      setStatus("error");
      setServerMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your message.",
      );
    }
  };

  const statusMessage = useMemo(() => {
    if (status === "success" && serverMessage) {
      return serverMessage;
    }

    if (status === "error") {
      if (serverMessage) {
        return serverMessage;
      }

      if (hasErrors) {
        return "Please fix the highlighted fields and try again.";
      }

      return "Something went wrong while sending your message. Please try again.";
    }

    return "";
  }, [hasErrors, serverMessage, status]);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      noValidate
      aria-describedby={statusMessage ? "contact-form-status" : undefined}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            placeholder="Your full name"
            autoComplete="name"
            value={values.name}
            onChange={handleFieldChange("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={values.email}
            onChange={handleFieldChange("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-company">Company (optional)</Label>
        <Input
          id="contact-company"
          name="company"
          placeholder="Where do you work?"
          autoComplete="organization"
          value={values.company ?? ""}
          onChange={handleFieldChange("company")}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Project details</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Tell me about the challenge, goals, timeline, and your team."
          value={values.message}
          onChange={handleFieldChange("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-sm text-destructive">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          className={cn(buttonVariants({ size: "lg" }), "md:w-auto")}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
        {statusMessage ? (
          <p
            id="contact-form-status"
            className="text-sm text-muted-foreground"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
