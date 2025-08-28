"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash2, Calendar, Eye, EyeOff, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const createPollSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  allowMultipleVotes: z.boolean().default(false),
  endDate: z.string().optional(),
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required"),
  })).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
});

type CreatePollForm = z.infer<typeof createPollSchema>;

export function CreatePollForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<CreatePollForm>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      allowMultipleVotes: false,
      options: [
        { text: "" },
        { text: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: CreatePollForm) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/polls/${result.poll.id}`);
      } else {
        const error = await response.json();
        setError(error.message || "Failed to create poll");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    if (fields.length < 10) {
      append({ text: "" });
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a new poll and share it with others
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              {...form.register("title")}
              placeholder="What would you like to ask?"
              className="w-full"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <textarea
              {...form.register("description")}
              placeholder="Add more context to your poll..."
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Poll Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Poll Options *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={fields.length >= 10}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...form.register(`options.${index}.text`)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {form.formState.errors.options && (
              <p className="text-sm text-red-500">
                {form.formState.errors.options.message}
              </p>
            )}
          </div>

          {/* Poll Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Poll Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date (Optional)
                </label>
                <Input
                  {...form.register("endDate")}
                  type="datetime-local"
                  className="w-full"
                />
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visibility
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    {...form.register("isPublic")}
                    type="checkbox"
                    id="isPublic"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Public poll (visible to everyone)
                  </label>
                </div>
              </div>
            </div>

            {/* Multiple Votes */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Voting Options
              </label>
              <div className="flex items-center space-x-2">
                <input
                  {...form.register("allowMultipleVotes")}
                  type="checkbox"
                  id="allowMultipleVotes"
                  className="rounded border-gray-300"
                />
                <label htmlFor="allowMultipleVotes" className="text-sm">
                  Allow multiple votes per user
                </label>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Creating Poll..." : "Create Poll"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
