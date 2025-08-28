"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PollCard } from "./PollCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Search, Plus, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

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
  options: Array<{
    id: string;
    text: string;
    order: number;
    _count: {
      votes: number;
    };
  }>;
  _count: {
    votes: number;
  };
}

interface PollsListProps {
  userId?: string;
  title?: string;
  description?: string;
}

export function PollsList({ userId, title = "All Polls", description = "Discover and participate in polls" }: PollsListProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userVotes, setUserVotes] = useState<Record<string, string[]>>({});

  const fetchPolls = async (pageNum: number, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
      });

      if (search) {
        params.append("search", search);
      }

      if (userId) {
        params.append("userId", userId);
      }

      const response = await fetch(`/api/polls?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (pageNum === 1) {
          setPolls(data.polls);
        } else {
          setPolls(prev => [...prev, ...data.polls]);
        }
        
        setHasMore(data.pagination.page < data.pagination.pages);
      } else {
        setError("Failed to fetch polls");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/polls/votes?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        const votesMap: Record<string, string[]> = {};
        data.votes.forEach((vote: any) => {
          if (!votesMap[vote.pollId]) {
            votesMap[vote.pollId] = [];
          }
          votesMap[vote.pollId].push(vote.optionId);
        });
        setUserVotes(votesMap);
      }
    } catch (error) {
      console.error("Failed to fetch user votes:", error);
    }
  };

  useEffect(() => {
    fetchPolls(1, searchQuery);
    fetchUserVotes();
  }, [searchQuery, userId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPolls(1, searchQuery);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPolls(nextPage, searchQuery);
  };

  const handleVote = (pollId: string, optionId: string) => {
    if (optionId === "") {
      // View results - update the poll to show results
      setPolls(prev => prev.map(poll => 
        poll.id === pollId ? { ...poll, showResults: true } : poll
      ));
      return;
    }

    // Update user votes
    setUserVotes(prev => ({
      ...prev,
      [pollId]: [...(prev[pollId] || []), optionId]
    }));

    // Update poll vote counts
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id === optionId) {
              return {
                ...option,
                _count: {
                  votes: option._count.votes + 1
                }
              };
            }
            return option;
          }),
          _count: {
            votes: poll._count.votes + 1
          }
        };
      }
      return poll;
    }));
  };

  const handleRefresh = () => {
    setPage(1);
    setPolls([]);
    fetchPolls(1, searchQuery);
    fetchUserVotes();
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        
        {session && (
          <Button onClick={() => router.push("/create-poll")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Poll
          </Button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search polls..."
          icon={<Search className="h-4 w-4" />}
          className="flex-1"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </form>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Polls */}
      {polls.length === 0 && !loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? "No polls found matching your search." : "No polls available yet."}
              </p>
              {session && !searchQuery && (
                <Button
                  onClick={() => router.push("/create-poll")}
                  className="mt-4"
                >
                  Create the first poll
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              userVotes={userVotes[poll.id] || []}
              onVote={(optionId) => handleVote(poll.id, optionId)}
              showResults={poll.showResults}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && polls.length > 0 && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
