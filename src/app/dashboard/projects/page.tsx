import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getProjects } from "~/server/db/data";
import DeleteProjectButton from "./_components/DeleteProjectButton";

export default async function Projects() {
  const { data: projects, success, message } = await getProjects();

  if (!success) {
    console.log(message);
  }

  return (
    <div className="">
      <h1 className="pb-5 text-3xl font-black">Projects</h1>
      <a href="/dashboard/projects/add">
        <Button className="mb-5">
          <Plus /> Add project
        </Button>
      </a>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Naam</TableHead>
            <TableHead>Klant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-[#171717]">
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="w-[250px] font-medium">
                {project.name}
              </TableCell>
              <TableCell>{project.client.companyName}</TableCell>
              <TableCell className="flex flex-wrap justify-end gap-3">
                <a href={`/dashboard/projects/${project.id}`}>
                  <Button>
                    <Eye />
                  </Button>
                </a>
                <DeleteProjectButton projectId={project.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
