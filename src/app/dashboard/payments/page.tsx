import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { getPayments } from "~/server/db/data";
import CreatePaymentButton from "./_components/CreatePaymentButton";
import EditPaymentButton from "./_components/EditPaymentButton";
import DeletePaymentButton from "./_components/DeletePaymentButton";
import { toEur } from "~/lib/utils";
import StatusBadge from "~/components/StatusBadge";
import { statusses } from "~/lib/constants";

export default async function Payments() {
  const { data: payments, success, message } = await getPayments();

  if (!success) {
    console.log(message);
  }

  return (
    <div className="">
      <h1 className="pb-5 text-3xl font-black">Payments</h1>
      <CreatePaymentButton />
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">ID</TableHead> */}
            <TableHead>Project</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment type</TableHead>
            <TableHead>Recurring frequency</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              {/* <TableCell className="font-medium">{payment.id}</TableCell> */}
              <TableCell className="font-medium">
                {payment.project.name}
              </TableCell>
              <TableCell>{toEur(payment.amount)}</TableCell>
              <TableCell>{payment.date || "-"}</TableCell>
              <TableCell>{payment.paymentType}</TableCell>
              <TableCell>{payment.recurringFrequency || "-"}</TableCell>
              <TableCell className="w-[150px]">
                <StatusBadge
                  text={
                    statusses.find((s) => s.id === payment.paymentStatus)
                      ?.label ?? "Unknown"
                  }
                />
              </TableCell>
              <TableCell className="flex flex-wrap gap-3 text-right">
                <EditPaymentButton payment={payment} />
                <DeletePaymentButton paymentId={payment.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
