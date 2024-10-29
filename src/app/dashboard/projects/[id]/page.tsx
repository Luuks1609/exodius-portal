import { getProjectById } from "~/server/db/data";
import ProjectForm from "../_components/ProjectForm";
import { Project } from "~/lib/types";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return <div>Loading...</div>;
  }

  const { data: project, success, message } = await getProjectById(Number(id));

  if (!success) {
    return <div>Error: {message}</div>;
  }

  return (
    <div>
      <h1 className="pb-5 text-3xl font-black">Edit project</h1>
      {project && <ProjectForm editData={project as Project} />}
    </div>
  );
}
