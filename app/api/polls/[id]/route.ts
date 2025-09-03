import { createServerClient } from '@supabase/ssr';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET a specific poll with its options and results
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;

    // Create supabase client for server-side
    const cookieStore = cookies();
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Fetch poll data
    const { data: poll, error: pollError } = await supabaseClient
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollError) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // Fetch poll options
    const { data: options, error: optionsError } = await supabaseClient
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId)
      .order("position", { ascending: true });

    if (optionsError) {
      return NextResponse.json(
        { error: "Failed to fetch poll options" },
        { status: 500 }
      );
    }

    // Fetch vote results
    const { data: results, error: resultsError } = await supabaseClient
      .rpc("get_poll_results", { poll_id: pollId });

    if (resultsError) {
      return NextResponse.json(
        { error: "Failed to fetch poll results" },
        { status: 500 }
      );
    }

    // Calculate total votes
    const totalVotes = results.reduce(
      (sum: number, option: any) => sum + option.vote_count,
      0
    );

    // Check if user has already voted
    const { data: session } = await supabaseClient.auth.getSession();
    let userVote = null;

    if (session?.session) {
      const { data: vote } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("poll_id", pollId)
        .eq("user_id", session.session.user.id)
        .single();

      userVote = vote;
    }

    return NextResponse.json({
      poll: {
        ...poll,
        options,
        results,
        total_votes: totalVotes,
        user_vote: userVote,
      },
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST to vote on a poll
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const { optionId } = await request.json();

    // Validate required fields
    if (!optionId) {
      return NextResponse.json(
        { error: "Option ID is required" },
        { status: 400 }
      );
    }
    // Create supabase client for server-side
    const cookieStore = cookies();
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get the user session
    const { data: { session } } = await supabaseClient.auth.getSession();

    // Verify the option belongs to the poll
    const { data: option, error: optionError } = await supabaseClient
      .from("poll_options")
      .select("*")
      .eq("id", optionId)
      .eq("poll_id", pollId)
      .single();

    if (optionError || !option) {
      return NextResponse.json(
        { error: "Invalid option for this poll" },
        { status: 400 }
      );
    }

    // Check if the user has already voted on this poll
    if (session) {
      const { data: existingVote, error: voteCheckError } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("poll_id", pollId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingVote) {
        return NextResponse.json(
          { error: "You have already voted on this poll" },
          { status: 400 }
        );
      }
    }

    // Create the vote
    const voteData = {
      poll_id: pollId,
      option_id: optionId,
      user_id: session?.user.id,
      anonymous_user_id: !session ? crypto.randomUUID() : null,
    };

    const { data: vote, error: voteError } = await supabaseClient
      .from("votes")
      .insert(voteData)
      .select()
      .single();

    if (voteError) {
      console.error("Error creating vote:", voteError);
      return NextResponse.json(
        { error: "Failed to submit vote" },
        { status: 500 }
      );
    }

    // Fetch updated results
    const { data: results } = await supabaseClient
      .rpc("get_poll_results", { poll_id: pollId });

    // Calculate total votes
    const totalVotes = results.reduce(
      (sum: number, option: any) => sum + option.vote_count,
      0
    );

    return NextResponse.json({
      success: true,
      vote,
      results,
      total_votes: totalVotes,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}