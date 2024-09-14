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

    if (!Array.isArray(body)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    // Filter for new entries (entries without id)
    const newEntries = body.filter((entry: any) => !entry.id);

    if (newEntries.length > 0) {
      const createdWorkExperiences = await Promise.all(
        newEntries.map(async (experience: any) => {
          return await prisma.workExperience.create({
            data: {
              company: experience.company,
              role: experience.role,
              detail: experience.detail ? experience.detail : null,
              startDate: new Date(experience.startDate),
              endDate: experience.endDate ? new Date(experience.endDate) : null,
              currentlyWorking: experience.currentlyWorking,
              user: {
                connect: {
                  id: currentUser.id
                }
              }
            }
          });
        })
      );

      return new NextResponse(JSON.stringify(createdWorkExperiences), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse("No new entries to create", { status: 400 });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
