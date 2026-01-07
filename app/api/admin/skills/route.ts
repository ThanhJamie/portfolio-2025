import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { SkillInput } from "../types";
import { prisma, validateAuth, unauthorized, revalidateSite } from "../_shared";

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
    const data = (await request.json()) as SkillInput;
    const skill = await prisma.skill.create({
      data: data as Parameters<typeof prisma.skill.create>[0]["data"],
    });
    revalidateSite();
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
    const body = (await request.json()) as { id?: string } & Partial<SkillInput>;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.skill.update>[0]["data"],
    });
    revalidateSite();
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
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
