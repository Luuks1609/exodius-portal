import ProjectForm from "../_components/ProjectForm";

export default function () {
  // wysiwyg editor
  // other trivial stuff like progress bar etc
  return (
    <div>
      <h1 className="pb-5 text-3xl font-black">New project</h1>
      <ProjectForm />
    </div>
  );
}
