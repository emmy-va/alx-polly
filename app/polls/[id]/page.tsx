import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { PollWithOptionsAndResults } from "@/app/types/database";

type PollDetailParams = {
  params: {
    id: string;
  };
};

const voteFormSchema = z.object({
  optionId: z.string({
    required_error: "Please select an option to vote.",
  }),
});

type VoteFormValues = z.infer<typeof voteFormSchema>;

export default function PollDetailPage({ params }: PollDetailParams) {
  const router = useRouter();
  const [poll, setPoll] = useState<PollWithOptionsAndResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteFormSchema),
  });

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch poll with options
        const { data: pollData, error: pollError } = await supabase
          .from("polls")
          .select("*")
          .eq("id", params.id)
          .single();

        if (pollError) throw new Error(pollError.message);
        if (!pollData) throw new Error("Poll not found");

        // Fetch poll options
        const { data: optionsData, error: optionsError } = await supabase
          .from("poll_options")
          .select("*")
          .eq("poll_id", params.id)
          .order("position", { ascending: true });

        if (optionsError) throw new Error(optionsError.message);

        // Fetch vote counts for each option
        const { data: votesData, error: votesError } = await supabase
          .rpc("get_poll_results", { poll_id: params.id });

        if (votesError) throw new Error(votesError.message);

        // Combine data
        const pollWithDetails: PollWithOptionsAndResults = {
          ...pollData,
          options: optionsData || [],
          results: votesData || [],
          total_votes: votesData ? votesData.reduce((sum: number, option: any) => sum + option.vote_count, 0) : 0,
        };

        setPoll(pollWithDetails);
      } catch (err: any) {
        console.error("Error fetching poll:", err);
        setError(err.message || "Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params.id]);

  const onSubmitVote = async (values: VoteFormValues) => {
    setVoteSubmitting(true);
    setError(null);

    try {
      // Get the poll_id from the selected option
      const selectedOption = poll?.options.find(option => option.id === values.optionId);
      if (!selectedOption) throw new Error("Invalid option selected");

      // Submit vote
      const { error: voteError } = await supabase
        .from("votes")
        .insert({
          poll_id: params.id,
          option_id: values.optionId,
        });

      if (voteError) {
        if (voteError.code === "23505") { // Unique constraint violation
          throw new Error("You have already voted on this poll");
        }
        throw new Error(voteError.message);
      }

      setVoteSuccess(true);
      
      // Refresh poll data to show updated results
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to submit vote");
    } finally {
      setVoteSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading poll...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">{error || "Poll not found"}</div>
            <Button 
              onClick={() => router.push("/polls")} 
              className="mt-4 mx-auto block"
            >
              Back to Polls
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          {poll.description && <p className="mt-2 text-gray-600">{poll.description}</p>}
        </CardHeader>
        <CardContent>
          {voteSuccess ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md text-green-700 text-center">
                Your vote has been recorded!
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Current Results</h3>
                {poll.results.map((result) => {
                  const option = poll.options.find(opt => opt.id === result.option_id);
                  const percentage = poll.total_votes > 0 
                    ? Math.round((result.vote_count / poll.total_votes) * 100) 
                    : 0;
                  
                  return (
                    <div key={result.option_id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option?.text}</span>
                        <span>{result.vote_count} votes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                <div className="text-sm text-gray-500 text-center mt-4">
                  Total votes: {poll.total_votes}
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitVote)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="optionId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          {poll.options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id}>{option.text}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={voteSubmitting}
                >
                  {voteSubmitting ? "Submitting Vote..." : "Submit Vote"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}