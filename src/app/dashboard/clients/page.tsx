import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getClients } from "~/server/db/data";
import CreateClientButton from "./_components/CreateClientButton";
import EditClientButton from "./_components/EditClientButton";
import DeleteClientButton from "./_components/DeleteClientButton";

export default async function Clients() {
  const { data: clients, success, message } = await getClients();

  if (!success) {
    console.log(message);
  }

  return (
    <div className="">
      <h1 className="pb-5 text-3xl font-black">Clients</h1>
      <CreateClientButton />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Bedrijf</TableHead>
            <TableHead>Contactpersoon</TableHead>
            <TableHead>E-mailadres</TableHead>
            <TableHead className="">Telefoonnummer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                {client.companyName}
              </TableCell>
              <TableCell>{client.contactName}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell className="space-x-3 text-right">
                <EditClientButton client={client} />
                <DeleteClientButton clientId={client.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
