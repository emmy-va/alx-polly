import { createServerClient } from '@supabase/ssr';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/app/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, options, isPublic = true, allowMultipleVotes = false } = body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "Title and at least two options are required" },
        { status: 400 }
      );
    }

  // Get the user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", redirect: "/login" },
      { status: 401 }
    );
  }

    // Create the poll
    const { data: poll, error: pollError } = await supabaseClient
      .from("polls")
      .insert({
        title,
        description,
        user_id: session.user.id,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
      })
      .select()
      .single();

    if (pollError) {
      console.error("Error creating poll:", pollError);
      return NextResponse.json(
        { error: "Failed to create poll" },
        { status: 500 }
      );
    }

    // Create the poll options
    const optionsToInsert = options.map((text: string, index: number) => ({
      poll_id: poll.id,
      text,
      position: index,
    }));

    const { data: pollOptions, error: optionsError } = await supabaseClient
      .from("poll_options")
      .insert(optionsToInsert)
      .select();

    if (optionsError) {
      console.error("Error creating poll options:", optionsError);
      await supabaseClient.from("polls").delete().eq("id", poll.id);
      return NextResponse.json(
        { error: "Failed to create poll options" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      poll: {
        ...poll,
        options: pollOptions,
      },
    });
  } catch (error) {
    console.error("Unexpected error creating poll:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}