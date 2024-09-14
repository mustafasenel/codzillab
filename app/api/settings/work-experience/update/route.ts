import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    // Validate the data
    if (!Array.isArray(body)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    const updatedEntries = body.filter((entry: any) => entry.id); // Filter for updated entries

    if (updatedEntries.length === 0) {
      return new NextResponse("No entries to update", { status: 400 });
    }

    const updatePromises = updatedEntries.map((entry: any) => 
      prisma.workExperience.update({
        where: { id: entry.id },
        data: {
          company: entry.company,
          role: entry.role,
          detail: entry.detail ? entry.detail : null,
          startDate: new Date(entry.startDate),
          endDate: entry.endDate ? new Date(entry.endDate) : null,
          currentlyWorking: entry.currentlyWorking,
        }
      })
    );

    const updatedWorkExperiences = await Promise.all(updatePromises);

    return new NextResponse(JSON.stringify(updatedWorkExperiences), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
