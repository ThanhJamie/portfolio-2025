import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { EducationInput } from "../types";
import { prisma, validateAuth, unauthorized } from "../_shared";

// GET all education
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const education = await prisma.education.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(education);
  } catch {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

// POST create new education
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as EducationInput;
    const education = await prisma.education.create({
      data: data as Parameters<typeof prisma.education.create>[0]["data"],
    });
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

// PUT update education
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as { id?: string } & Partial<EducationInput>;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const education = await prisma.education.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.education.update>[0]["data"],
    });
    return NextResponse.json(education);
  } catch {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

// DELETE education
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
