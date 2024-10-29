"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import PaymentForm from "./PaymentForm";

export default function CreatePaymentButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mb-5" onClick={() => setIsDialogOpen(true)}>
          <Plus /> Add payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <PaymentForm onSubmit={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
