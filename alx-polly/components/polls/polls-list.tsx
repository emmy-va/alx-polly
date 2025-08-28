"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PollCard } from "./poll-card"

// Mock data for development
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Choose the programming language you enjoy working with the most",
    options: [
      { id: "1-1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "1-2", text: "Python", votes: 38 },
      { id: "1-3", text: "Java", votes: 22 },
      { id: "1-4", text: "C++", votes: 15 },
    ],
    totalVotes: 120,
    createdAt: "2024-01-15T10:00:00Z",
    author: "John Doe"
  },
  {
    id: "2",
    title: "Which framework do you prefer for web development?",
    description: "Select your go-to framework for building web applications",
    options: [
      { id: "2-1", text: "React", votes: 52 },
      { id: "2-2", text: "Vue.js", votes: 28 },
      { id: "2-3", text: "Angular", votes: 20 },
      { id: "2-4", text: "Svelte", votes: 12 },
    ],
    totalVotes: 112,
    createdAt: "2024-01-14T15:30:00Z",
    author: "Jane Smith"
  }
]

export function PollsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [polls] = useState(mockPolls)

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Polls</h1>
          <p className="text-muted-foreground mt-1">
            Discover and participate in polls from the community
          </p>
        </div>
        
        <Button className="flex items-center gap-2">
          Create Poll
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search polls..."
          className="flex-1"
        />
        <Button variant="outline">
          Search
        </Button>
      </div>

      {/* Polls */}
      {filteredPolls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchQuery ? "No polls found matching your search." : "No polls available yet."}
          </p>
          <Button className="mt-4">
            Create the first poll
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  )
}
