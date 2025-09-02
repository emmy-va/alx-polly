"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { PollOption } from "@/app/types/database";

const voteFormSchema = z.object({
  optionId: z.string({
    required_error: "Please select an option",
  }),
});

type VoteFormValues = z.infer<typeof voteFormSchema>;

interface VoteFormProps {
  pollId: string;
  options: PollOption[];
  onVoteSubmitted?: (results: any) => void;
}

export function VoteForm({ pollId, options, onVoteSubmitted }: VoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteFormSchema),
    defaultValues: {
      optionId: "",
    },
  });

  async function onSubmit(data: VoteFormValues) {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: data.optionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit vote");
      }

      toast.success("Vote submitted successfully!");
      
      // Call the callback with the results if provided
      if (onVoteSubmitted) {
        onVoteSubmitted(result);
      }
      
      // Refresh the page data
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="optionId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select an option</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {options.map((option) => (
                        <FormItem
                          key={option.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.id} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {option.text}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Vote"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}