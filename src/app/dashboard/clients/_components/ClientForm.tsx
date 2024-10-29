"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { createClient, updateClient } from "~/server/db/actions";
import { clientFormSchema } from "~/server/db/schema";
import { Client } from "~/lib/types";
import { useToast } from "~/hooks/use-toast";

interface Props {
  onSubmit?: () => void;
  editData?: Client;
}

export default function ClientForm({ onSubmit, editData }: Props) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: editData?.companyName ?? "",
      contactName: editData?.contactName ?? "",
      email: editData?.email ?? "",
      phone: editData?.phone ?? "",
    },
  });

  async function handleSubmit(data: z.infer<typeof clientFormSchema>) {
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("contactName", data.contactName ?? "");
    formData.append("email", data.email);
    formData.append("phone", data.phone ?? "");
    if (editData) {
      const { data: success, errors } = await updateClient(
        editData.id,
        formData,
      );
      if (errors) {
        console.log(errors);
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
      }
      if (success) {
        toast({
          title: "Client updated succesfully!",
        });
        form.reset();

        if (onSubmit) {
          onSubmit();
        }
      }
    } else {
      const { data: success, errors } = await createClient(formData);
      if (errors) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
        console.log(errors);
      }
      if (success) {
        toast({
          title: "Client added succesfully!",
        });
        form.reset();

        if (onSubmit) {
          onSubmit();
        }
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrijf</FormLabel>
              <FormControl>
                <Input placeholder="Bedrijfsnaam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contactpersoon</FormLabel>
              <FormControl>
                <Input placeholder="Naam van contactpersoon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mailadres</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefoonnummer</FormLabel>
              <FormControl>
                <Input placeholder="Telefoonnummer" {...field} />
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
