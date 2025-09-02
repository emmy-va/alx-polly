"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PollResult } from "@/app/types/database";

interface VoteResultsProps {
  results: PollResult[];
  totalVotes: number;
}

export function VoteResults({ results, totalVotes }: VoteResultsProps) {
  // Sort results by vote count (highest first)
  const sortedResults = [...results].sort((a, b) => b.vote_count - a.vote_count);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {totalVotes === 0 ? (
            <p className="text-muted-foreground">No votes yet</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Total votes: {totalVotes}
              </p>
              {sortedResults.map((result) => {
                const percentage = totalVotes > 0 
                  ? Math.round((result.vote_count / totalVotes) * 100) 
                  : 0;
                
                return (
                  <div key={result.option_id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{result.option_text}</span>
                      <span className="font-medium">
                        {percentage}% ({result.vote_count})
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}