import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma, validateAuth, unauthorized } from "../_shared";

// GET all profiles (usually just one)
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const profiles = await prisma.profile.findMany();
    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

// POST create new profile
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as Prisma.ProfileCreateInput;
    const profile = await prisma.profile.create({ data });
    return NextResponse.json(profile, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

// PUT update profile
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as { id?: string } & Prisma.ProfileUpdateInput;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
