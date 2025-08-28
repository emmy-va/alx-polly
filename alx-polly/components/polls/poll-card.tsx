"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PollCardProps {
  poll: {
    id: string
    title: string
    description?: string
    options: Array<{
      id: string
      text: string
      votes: number
    }>
    totalVotes: number
    createdAt: string
    author: string
  }
}

export function PollCard({ poll }: PollCardProps) {
  const handleVote = (optionId: string) => {
    // TODO: Implement voting logic
    console.log(`Voted for option: ${optionId}`)
  }

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription className="text-base">
            {poll.description}
          </CardDescription>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By {poll.author}</span>
          <span>•</span>
          <span>{poll.totalVotes} votes</span>
          <span>•</span>
          <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {poll.options.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(option.id)}
                className="flex items-center gap-2"
              >
                Vote
              </Button>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-muted-foreground">
                    {poll.totalVotes > 0 
                      ? `${Math.round((option.votes / poll.totalVotes) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: poll.totalVotes > 0 
                        ? `${(option.votes / poll.totalVotes) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
