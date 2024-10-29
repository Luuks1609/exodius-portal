"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Payment } from "~/lib/types";
import PaymentForm from "./PaymentForm";

export default function EditPaymentButton({ payment }: { payment: Payment }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <PaymentForm onSubmit={handleClose} editData={payment} />
      </DialogContent>
    </Dialog>
  );
}
