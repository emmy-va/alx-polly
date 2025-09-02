import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PollNotFound() {
  return (
    <div className="container max-w-3xl py-16 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Poll Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The poll you're looking for doesn't exist or has been deleted.
      </p>
      <Link href="/polls" passHref>
        <Button>Back to Polls</Button>
      </Link>
    </div>
  );
}