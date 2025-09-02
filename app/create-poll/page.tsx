import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PollForm from "@/components/PollForm";

export default function CreatePollPage() {
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
