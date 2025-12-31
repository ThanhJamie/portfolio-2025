import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ProjectInput } from "../types";
import { prisma, validateAuth, unauthorized } from "../_shared";

// GET all projects
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as ProjectInput;
    const project = await prisma.project.create({
      data: data as Parameters<typeof prisma.project.create>[0]["data"],
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// PUT update project
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as { id?: string } & Partial<ProjectInput>;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.project.update>[0]["data"],
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
