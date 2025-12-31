import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma, validateAuth, unauthorized } from "../_shared";

// GET all certifications
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(certifications);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 },
    );
  }
}

// POST create new certification
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as Prisma.CertificationCreateInput;
    const certification = await prisma.certification.create({ data });
    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 },
    );
  }
}

// PUT update certification
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as {
      id?: string;
    } & Prisma.CertificationUpdateInput;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(certification);
  } catch {
    return NextResponse.json(
      { error: "Failed to update certification" },
      { status: 500 },
    );
  }
}

// DELETE certification
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 },
    );
  }
}
