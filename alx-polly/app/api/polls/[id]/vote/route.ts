import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const voteSchema = z.object({
  optionId: z.string().min(1, "Option ID is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { optionId } = voteSchema.parse(body);
    const pollId = params.id;

    // Get poll and check if it's active
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
        votes: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!poll) {
      return NextResponse.json(
        { message: "Poll not found" },
        { status: 404 }
      );
    }

    if (!poll.isActive) {
      return NextResponse.json(
        { message: "Poll is not active" },
        { status: 400 }
      );
    }

    // Check if poll has ended
    if (poll.endDate && new Date() > poll.endDate) {
      return NextResponse.json(
        { message: "Poll has ended" },
        { status: 400 }
      );
    }

    // Check if option exists
    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return NextResponse.json(
        { message: "Invalid option" },
        { status: 400 }
      );
    }

    // Check if user has already voted for this option
    const existingVote = poll.votes.find(vote => vote.optionId === optionId);
    if (existingVote) {
      return NextResponse.json(
        { message: "You have already voted for this option" },
        { status: 400 }
      );
    }

    // Check if user has already voted and poll doesn't allow multiple votes
    if (!poll.allowMultipleVotes && poll.votes.length > 0) {
      return NextResponse.json(
        { message: "This poll only allows one vote per user" },
        { status: 400 }
      );
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        pollId: pollId,
        optionId: optionId,
      },
      include: {
        option: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Vote recorded successfully", vote },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Vote error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
