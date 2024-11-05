"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
import { createProject, updateProject } from "~/server/db/actions"; // Assuming you have these actions
import { projectFormSchema } from "~/server/db/schema";
import type { Client, Project } from "~/lib/types";
import { useToast } from "~/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getClients } from "~/server/db/data";
import { useRouter } from "next/navigation";

import Editor from "~/components/Editor";

interface Props {
  onSubmit?: () => void;
  editData?: Project;
}

export default function ProjectForm({ onSubmit, editData }: Props) {
  const [clients, setClients] = useState<Client[]>([]);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      clientId: editData?.clientId ?? 0,
      name: editData?.name ?? "",
      description: editData?.description ?? "",
      notes: editData?.notes ?? "",
      startDate: editData?.startDate ?? "",
      endDate: editData?.endDate ?? "",
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getClients();
        if (response.success) {
          setClients(response.data as Client[]);
        } else {
          console.error("Failed to fetch clients:", response.message);
        }
      } catch (error) {
        console.error("Error in fetchProjects:", error);
      }
    };
    void fetchProjects(); // Explicitly marking the promise as ignored
  }, []);

  async function handleSubmit(data: z.infer<typeof projectFormSchema>) {
    const formData = new FormData();
    formData.append("clientId", String(data.clientId));
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("notes", data.notes ?? "");
    formData.append("startDate", data.startDate ?? "");

    try {
      if (editData) {
        const { data: success, errors } = await updateProject(
          editData.id,
          formData,
        );
        if (errors) {
          console.log(errors);
          toast({
            variant: "destructive",
            title: "Something went wrong!",
          });
        } else if (success) {
          toast({
            title: "Project updated successfully!",
          });
          form.reset();
          if (onSubmit) {
            onSubmit();
          }
        }
      } else {
        const { data: success, errors } = await createProject(formData);
        if (errors) {
          toast({
            variant: "destructive",
            title: "Something went wrong!",
          });
          console.log(errors);
        } else if (success) {
          toast({
            title: "Project added successfully!",
          });
          form.reset();
          router.push("/dashboard/projects");
          if (onSubmit) {
            onSubmit();
          }
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="clientId"
          render={({
            field,
          }: {
            field: {
              onChange: (value: number) => void;
              value: number | undefined;
            };
          }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value: string) =>
                    field.onChange(Number(value))
                  }
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.companyName}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Project Name" {...field} />
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
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Editor
                  onContentChange={(content) => field.onChange(content)}
                  editData={editData?.notes ?? ""}
                />
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
