"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import type { Log } from "~/lib/types";

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "success" ? "default" : "destructive"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "errorMessage",
    header: "Error Message",
  },
];
