import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Poll } from "@/app/types/database";

interface PollsDashboardProps {
  polls: Poll[];
}

export default function PollsDashboard({ polls = [] }: PollsDashboardProps) {
  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Polls</h1>
        <Link href="/create-poll" passHref>
          <Button className="bg-primary hover:bg-primary/90">
            Create New Poll
          </Button>
        </Link>
      </div>
      
      {polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No polls found</p>
          <Link href="/create-poll" passHref>
            <Button variant="outline">Create your first poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <Link href={`/polls/${poll.id}`} key={poll.id} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {poll.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {poll.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
