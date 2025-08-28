import { Suspense } from "react";
import { CreatePollForm } from "@/components/polls/CreatePollForm";

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <CreatePollForm />
      </Suspense>
    </div>
  );
}
