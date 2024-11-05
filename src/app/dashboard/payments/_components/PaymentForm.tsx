"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { createPayment, updatePayment } from "~/server/db/actions";
import { paymentFormSchema } from "~/server/db/schema";

import { useToast } from "~/hooks/use-toast";
import { getProjects } from "~/server/db/data";
import { statusses } from "~/lib/constants";

import type { Payment, Project } from "~/lib/types";
import type { z } from "zod";

interface Props {
  onSubmit?: () => void;
  editData?: Payment;
}

export default function PaymentForm({ onSubmit, editData }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      projectId: editData?.projectId ?? 0,
      amount: editData?.amount ?? 0,
      date: editData?.date ?? "",
      description: editData?.description ?? "",
      paymentType: editData?.paymentType ?? "one-time",
      recurringFrequency: editData?.recurringFrequency ?? "", // Changed to empty string for optional handling
      paymentStatus: editData?.paymentStatus ?? 1,
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects();
      if (response.success) {
        setProjects(response.data as Project[]);
      }
    };
    fetchProjects().catch((error) => {
      console.error("Failed to fetch projects:", error);
    });
  }, []);

  async function handleSubmit(data: z.infer<typeof paymentFormSchema>) {
    const formData = new FormData();
    formData.append("projectId", data.projectId.toString());
    formData.append("amount", data.amount.toString());
    formData.append("date", data.date ?? "");
    formData.append("description", data.description ?? "");
    formData.append("paymentType", data.paymentType);
    formData.append(
      "recurringFrequency",
      data.paymentType === "recurring" ? (data.recurringFrequency ?? "") : "",
    ); // Only append if paymentType is recurring
    formData.append("paymentStatus", data.paymentStatus.toString());

    const { data: success, errors } = editData
      ? await updatePayment(editData.id, formData)
      : await createPayment(formData);

    if (errors) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
      });
      console.log(errors);
    } else if (success) {
      const message = editData
        ? "Payment updated successfully!"
        : "Payment added successfully!";
      toast({ title: message });
      form.reset();
      if (onSubmit) onSubmit();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Amount"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("paymentType") === "recurring" && ( // Only show if paymentType is recurring
          <FormField
            control={form.control}
            name="recurringFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurring Frequency</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusses.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {statusses.find((s) => s.id === status.id)?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
