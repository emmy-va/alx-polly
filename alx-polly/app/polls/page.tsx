import { Suspense } from "react";
import { PollsList } from "@/components/polls/PollsList";

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading polls...</div>}>
        <PollsList />
      </Suspense>
    </div>
  );
}
