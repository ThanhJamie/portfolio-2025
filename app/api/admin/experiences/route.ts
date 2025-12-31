import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma, validateAuth, unauthorized } from "../_shared";

// GET all experiences
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(experiences);
  } catch {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

// POST create new experience
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as Prisma.ExperienceCreateInput;
    const experience = await prisma.experience.create({ data });
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

// PUT update experience
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as { id?: string } & Prisma.ExperienceUpdateInput;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(experience);
  } catch {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

// DELETE experience
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
