import { PrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const resolvedParam = url.searchParams.get("resolved");

  const where: { resolved?: boolean } = {};
  if (resolvedParam === "true") where.resolved = true;
  if (resolvedParam === "false") where.resolved = false;

  try {
    const [incidents, resolvedCount] = await Promise.all([
      prisma.incident.findMany({
        where,
        include: { camera: true },
        orderBy: { tsStart: "desc" },
      }),
      prisma.incident.count({
        where: { resolved: true },
      }),
    ]);

    return NextResponse.json({ incidents, resolvedCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch incidents:", error);

    return NextResponse.json(
      { message: "Failed to fetch incidents", error: String(error) },
      { status: 500 }
    );
  }
}
