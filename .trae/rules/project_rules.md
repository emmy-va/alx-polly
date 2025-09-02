📜 Polling App – Rule File
1. Folder & File Structure

All feature code must live under /app/polls/ (for UI, components, forms) or /app/api/ (for backend routes).

Components should be grouped by domain. Example:

/app/polls/components/ → UI (PollCard, PollForm, ResultsGraph)

/app/polls/hooks/ → custom hooks (usePolls, useVote)

Avoid putting feature logic directly in /app/; always use the domain folder.

2. Forms & UI

Use react-hook-form for all forms.

Always pair forms with shadcn/ui components for inputs, buttons, etc.

Validation must be integrated with zod schemas before submission.

Example:

<Form {...form}>
  <FormField name="title" control={form.control} render={({ field }) => (
    <Input {...field} placeholder="Enter poll title" />
  )}/>
  <Button type="submit">Create Poll</Button>
</Form>

3. Database & Auth (Supabase)

All authentication and data persistence should go through Supabase.

Use Supabase client hooks in server actions or API routes (/app/api/).

Never call Supabase directly from client components; instead use server functions.

Example flow:

/app/api/polls/create/route.ts → inserts poll into Supabase

/app/polls/new/page.tsx → uses server action → calls API route

4. Type Safety & Reusability

Always define types in /app/types/ and reuse them.

Example: Poll, Vote, User interfaces should be imported, not redefined.

Prefer async/await over .then() for clarity.

5. Assistant Task Patterns

When scaffolding new features:

✅ “Create a form to submit a new poll” → Must generate React Hook Form + shadcn UI + zod validation + Supabase API route.

✅ “Add results chart” → Should scaffold using recharts under /app/polls/components/.

The AI should fail the rule check if it:

Places form outside /app/polls/

Uses plain <form> without react-hook-form

Skips Supabase integration for persistence