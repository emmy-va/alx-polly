import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PollForm from "@/components/PollForm";

export default function CreatePollPage() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Create a New Poll</h2>
      </CardHeader>
      <CardContent>
        <PollForm />
      </CardContent>
    </Card>
  );
}
