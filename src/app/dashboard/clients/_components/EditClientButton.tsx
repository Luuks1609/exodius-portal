"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import ClientForm from "./ClientForm";
import { Client } from "~/lib/types";

export default function EditClientButton({ client }: { client: Client }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mb-5" onClick={() => setIsDialogOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ClientForm onSubmit={handleClose} editData={client} />
      </DialogContent>
    </Dialog>
  );
}
