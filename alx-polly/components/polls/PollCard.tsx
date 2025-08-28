"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { Vote, Users, Calendar, Eye, EyeOff, BarChart3 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  order: number;
  _count: {
    votes: number;
  };
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  isPublic: boolean;
  allowMultipleVotes: boolean;
  endDate?: Date;
  createdAt: Date;
  user: {
    id: string;
    name?: string;
  };
  options: PollOption[];
  _count: {
    votes: number;
  };
}

interface PollCardProps {
  poll: Poll;
  userVotes?: string[];
  onVote?: (optionId: string) => void;
  showResults?: boolean;
}

export function PollCard({ poll, userVotes = [], onVote, showResults = false }: PollCardProps) {
  const { data: session } = useSession();
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState("");

  const totalVotes = poll.options.reduce((sum, option) => sum + option._count.votes, 0);
  const hasEnded = poll.endDate && new Date() > poll.endDate;
  const canVote = session && poll.isActive && !hasEnded;

  const handleVote = async (optionId: string) => {
    if (!canVote || isVoting) return;

    setIsVoting(true);
    setError("");

    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionId }),
      });

      if (response.ok) {
        onVote?.(optionId);
      } else {
        const error = await response.json();
        setError(error.message || "Failed to vote");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const isOptionVoted = (optionId: string) => userVotes.includes(optionId);

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base mb-3">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {poll.isPublic ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            <span>{poll.isPublic ? "Public" : "Private"}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{poll.user.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeTime(poll.createdAt)}</span>
          </div>
          {poll.endDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Ends {formatDate(poll.endDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Vote className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
        </div>

        {hasEnded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
            <p className="text-sm text-yellow-800">This poll has ended</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {poll.options.map((option) => {
            const voteCount = option._count.votes;
            const percentage = getVotePercentage(voteCount);
            const isVoted = isOptionVoted(option.id);

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  {canVote && !isVoted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(option.id)}
                      disabled={isVoting}
                      className="flex items-center gap-2"
                    >
                      <Vote className="h-4 w-4" />
                      Vote
                    </Button>
                  ) : (
                    <div className="w-16 h-8 flex items-center justify-center text-sm text-muted-foreground">
                      {isVoted ? "Voted" : "Can't vote"}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-sm text-muted-foreground">
                        {voteCount} votes ({percentage}%)
                      </span>
                    </div>
                    
                    {showResults && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showResults && canVote && (
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => onVote?.("")}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Results
            </Button>
          </div>
        )}

        {!session && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              Sign in to vote on this poll
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
