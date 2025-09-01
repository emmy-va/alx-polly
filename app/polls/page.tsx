"use client";

import PollsDashboard from "@/components/PollsDashboard";
import withAuth from "@/components/withAuth";

function PollsPage() {
  return <PollsDashboard />;
}

export default withAuth(PollsPage);
