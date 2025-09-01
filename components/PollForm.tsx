import { Card } from "@/components/ui/card";

export default function PollForm() {
  return (
    <Card className="max-w-lg mx-auto p-6 mt-8">
      <h3 className="font-bold text-xl mb-4">Create a New Poll</h3>
      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Poll Title</label>
          <input type="text" className="border p-2 rounded w-full" placeholder="Enter poll title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="border p-2 rounded w-full" placeholder="Describe your poll" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Options</label>
          <div className="flex flex-col gap-2">
            <input type="text" className="border p-2 rounded w-full" placeholder="Option 1" />
            <input type="text" className="border p-2 rounded w-full" placeholder="Option 2" />
            <input type="text" className="border p-2 rounded w-full" placeholder="Option 3" />
            <input type="text" className="border p-2 rounded w-full" placeholder="Option 4" />
          </div>
          <button type="button" className="mt-2 text-blue-600 hover:underline text-sm">+ Add Option</button>
        </div>
        <button type="submit" className="bg-blue-900 text-white py-2 rounded hover:bg-blue-800 font-semibold">Create Poll</button>
      </form>
    </Card>
  );
}
