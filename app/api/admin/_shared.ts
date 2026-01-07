import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2025";

// Revalidate all site paths after data changes
export function revalidateSite() {
  console.log("[Admin] 🔄 Revalidating site cache...");
  revalidatePath("/", "layout");
  console.log("[Admin] ✅ Cache invalidated");
}

export function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") return false;

  return token === ADMIN_PASSWORD;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export { prisma };
