"use client";

import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { deletePayment } from "~/server/db/actions";

export default function DeletePaymentButton({
  paymentId,
}: {
  paymentId: number;
}) {
  const { toast } = useToast();

  const handleDelete = async () => {
    const { data, errors } = await deletePayment(paymentId);
    if (errors) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
      });
      console.error(errors.message);
    } else {
      console.log(data);
      toast({
        title: "Payment deleted succesfully",
      });
    }
  };

  return (
    <Button variant={"destructive"} onClick={handleDelete}>
      <Trash2 />
    </Button>
  );
}
