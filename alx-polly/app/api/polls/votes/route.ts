import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const votes = await prisma.vote.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        pollId: true,
        optionId: true,
        createdAt: true,
        option: {
          select: {
            text: true,
          },
        },
        poll: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    console.error("Fetch votes error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
