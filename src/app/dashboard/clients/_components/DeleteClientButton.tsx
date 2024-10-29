"use client";

import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { deleteClient } from "~/server/db/actions";

export default function DeleteClientButton({ clientId }: { clientId: number }) {
  const { toast } = useToast();
  const handleDelete = async () => {
    const { data, errors } = await deleteClient(clientId);
    if (errors) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
      });
      console.error(errors.message);
    } else {
      console.log(data);
      toast({
        title: "Client deleted succesfully",
      });
    }
  };

  return (
    <Button variant={"destructive"} onClick={handleDelete}>
      <Trash2 />
    </Button>
  );
}
