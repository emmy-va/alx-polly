import { Card } from "@/components/ui/card";

const polls = [
  {
    title: "Favorite Programming Language",
    description: "What programming language do you prefer to use?",
    options: 5,
    votes: 42,
    created: "10/15/2023",
  },
  {
    title: "Best Frontend Framework",
    description: "Which frontend framework do you think is the best?",
    options: 4,
    votes: 38,
    created: "10/10/2023",
  },
  {
    title: "Preferred Database",
    description: "What database do you prefer to work with?",
    options: 5,
    votes: 27,
    created: "10/5/2023",
  },
];

export default function PollsDashboard() {
  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Polls</h1>
        <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">Create New Poll</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {polls.map((poll, idx) => (
          <Card key={idx} className="p-6 rounded border shadow-sm">
            <h2 className="font-semibold text-lg mb-1">{poll.title}</h2>
            <p className="text-sm text-muted-foreground mb-2">{poll.description}</p>
            <div className="text-xs mb-2">{poll.options} options</div>
            <div className="text-xs mb-2">{poll.votes} total votes</div>
            <div className="text-xs text-muted-foreground">Created on {poll.created}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
