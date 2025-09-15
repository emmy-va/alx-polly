import { createSupabaseServerClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import PollsDashboard from "@/components/PollsDashboard";

async function getPolls() {
  const supabase = createSupabaseServerClient({ cookies });
  const { data: polls, error } = await supabase
    .from("polls")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
  
  return polls || [];
}

export default async function PollsPage() {
  const polls = await getPolls();
  
  return (
    <div className="container py-8">
      <PollsDashboard polls={polls} />
    </div>
  );
}
