"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";

export default function FormPage() {
  const { toast } = useToast();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(20, {
        message: "Name cannot be more than 20 characters.",
      }),
    phoneNumber: z
      .string()
      .min(6, {
        message: "Phone number must be at least 6 digits.",
      })
      .max(20, {
        message: "Phone number cannot be more than 20 digits.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe",
      phoneNumber: "6209182232131",
    },
  });

  const [formState, setFormState] = useState({} as z.infer<typeof formSchema>);
  const [summaryCardState, setSummaryCardState] = useState(false as Boolean);

  const isFormFilled = summaryCardState && Object.keys(formState).length > 0;

  /**
   * TODO: ADD ONLY INPUT NUMBER FOR PHONE NUMBER
   */

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setFormState(data);
    setSummaryCardState(true);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <Card className="m-4 min-w-[24em] border-cyan-800 bg-slate-300 p-4">
        <CardTitle className="text-2xl">Example Form</CardTitle>
        <CardDescription className="text-sm">
          Using React Hooks Form and Zod
        </CardDescription>
        <CardContent className="flex flex-col justify-start gap-4 p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="pb-4 pt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone number"
                          {...field}
                          inputMode="numeric"
                          onKeyDown={(e) => {
                            return /^([0-9])$/.test(e.key);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isFormFilled && (
        <Card className="w-[24em] flex-row border-cyan-800 bg-slate-300 p-4">
          <div className="grid grid-flow-col justify-between">
            <div className="min-w-[5em]">
              <Label className="font-bold">Name</Label>
              <p className="text-sm">{formState.name}</p>
              <Label className="font-bold">Phone Number</Label>
              <p className="text-sm">{formState.phoneNumber}</p>
            </div>
            <button
              className="self-start"
              onClick={() => setSummaryCardState(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          </div>
        </Card>
      )}
    </main>
  );
}
