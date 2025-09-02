import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import PollsDashboard from "@/components/PollsDashboard";

async function getPolls() {
  const cookieStore = cookies();
  const supabaseClient = supabase.createClient(cookieStore);
  
  const { data: polls, error } = await supabaseClient
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
