import { PrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resolvedParam = searchParams.get("resolved");

  const whereClause: { resolved?: boolean } = {};

  if (resolvedParam !== null) {
    whereClause.resolved = resolvedParam === "true";
  }

  try {
    const [incidents, resolvedCount] = await Promise.all([
      prisma.incident.findMany({
        where: whereClause,
        include: {
          camera: true,
        },
        orderBy: {
          tsStart: "desc",
        },
      }),
      prisma.incident.count({
        where: {
          resolved: true,
        },
      }),
    ]);

    return NextResponse.json({ incidents, resolvedCount });
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
