import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma, validateAuth, unauthorized } from "../_shared";

// Type for metric input
interface MetricInput {
  label: string;
  value: string;
  description?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

// GET all metrics
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const metrics = await prisma.metric.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(metrics);
  } catch {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

// POST create new metric
export async function POST(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const data = (await request.json()) as MetricInput;
    const metric = await prisma.metric.create({
      data: data as Parameters<typeof prisma.metric.create>[0]["data"],
    });
    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create metric" }, { status: 500 });
  }
}

// PUT update metric
export async function PUT(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const body = (await request.json()) as { id?: string } & Partial<MetricInput>;
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const metric = await prisma.metric.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.metric.update>[0]["data"],
    });
    return NextResponse.json(metric);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update metric" }, { status: 500 });
  }
}

// DELETE metric
export async function DELETE(request: NextRequest) {
  if (!validateAuth(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.metric.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete metric" }, { status: 500 });
  }
}
