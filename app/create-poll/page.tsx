"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PollForm from "@/components/PollForm";
import withAuth from "@/components/withAuth";

function CreatePollPage() {
  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <PollForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CreatePollPage);
