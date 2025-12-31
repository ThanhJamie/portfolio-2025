import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma, validateAuth, unauthorized } from "../_shared";

// GET all skills
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

// POST create new skill
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as Prisma.SkillCreateInput;
    const skill = await prisma.skill.create({ data });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

// PUT update skill
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as { id?: string } & Prisma.SkillUpdateInput;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
