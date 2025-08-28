import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createPollSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  allowMultipleVotes: z.boolean().default(false),
  endDate: z.string().optional(),
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required"),
  })).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createPollSchema.parse(body);

    // Create poll with options
    const poll = await prisma.poll.create({
      data: {
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        allowMultipleVotes: data.allowMultipleVotes,
        endDate: data.endDate ? new Date(data.endDate) : null,
        userId: session.user.id,
        options: {
          create: data.options.map((option, index) => ({
            text: option.text,
            order: index,
          })),
        },
      },
      include: {
        options: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Poll created successfully", poll },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Create poll error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (userId) {
      where.userId = userId;
    } else {
      where.isPublic = true;
    }

    // Get polls with options and vote counts
    const polls = await prisma.poll.findMany({
      where,
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { votes: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.poll.count({ where });

    return NextResponse.json({
      polls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch polls error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
