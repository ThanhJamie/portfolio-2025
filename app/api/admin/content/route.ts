import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content/json");

// Simple password protection - in production, use proper auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2025";

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") return false;

  return token === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file) {
    // Return list of available content files
    const files = await getContentFiles(CONTENT_DIR);
    return NextResponse.json({ files });
  }

  try {
    const filePath = path.join(CONTENT_DIR, file);
    // Security: ensure file is within content directory
    if (!filePath.startsWith(CONTENT_DIR)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const content = await fs.readFile(filePath, "utf-8");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return NextResponse.json({ content: JSON.parse(content), file });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { file?: string; content?: unknown };
    const { file, content } = body;

    if (!file || !content) {
      return NextResponse.json({ error: "Missing file or content" }, { status: 400 });
    }

    const filePath = path.join(CONTENT_DIR, file);
    // Security: ensure file is within content directory
    if (!filePath.startsWith(CONTENT_DIR)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Content updated successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

async function getContentFiles(dir: string, prefix = ""): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const subFiles = await getContentFiles(path.join(dir, entry.name), relativePath);
      files.push(...subFiles);
    } else if (entry.name.endsWith(".json")) {
      files.push(relativePath);
    }
  }

  return files;
}
