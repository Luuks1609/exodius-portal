import { DataTable } from "~/components/ui/data-table";
import { getLogs } from "~/server/db/data";
import { columns } from "./columns";

export default async function Page() {
  const { data: logs, success, message } = await getLogs();

  if (!success) {
    console.log(message);
  }

  // const projects = [...new Set(logs?.map((log) => log.project))];

  // const logsByProject = projects.map((project) => ({
  //   project,
  //   logs: logs?.filter((log) => log.project === project),
  // }));

  return (
    <div className="space-y-5 px-4 sm:px-6 lg:px-8">
      <h1 className="pb-5 text-3xl font-black">Logs</h1>
      {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {logsByProject.map(({ project, logs }) => {
          const chartData = [
            {
              status: "success",
              calls:
                logs?.filter((log) => log.status === "success").length || 0,
              fill: "hsl(var(--primary))",
            },
            {
              status: "failed",
              calls: logs?.filter((log) => log.status === "failed").length || 0,
              fill: "hsl(var(--destructive))",
            },
          ];

          return (
            <LogPieChart key={project} data={chartData} project={project} />
          );
        })}
      </div> */}
      <DataTable data={logs!} columns={columns} />
    </div>
  );
}
