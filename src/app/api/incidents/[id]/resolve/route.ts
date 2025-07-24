import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { resolved: true },
      include: { camera: true },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(`Failed to resolve incident ${id}:`, error);

    return new NextResponse(
      JSON.stringify({ message: `Incident with ID ${id} not found.` }),
      { status: 404 }
    );
  }
}
