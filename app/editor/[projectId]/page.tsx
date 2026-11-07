import Navbar from "@/components/navbar";
import EditorForm from "@/components/editor-form";
import UserForm from "@/components/user-form";
import { verifySession } from "@/middleware/auth.middleware";
import { getProjectsForUser } from "@/lib/projects";

export default async function Page(props: PageProps<"/editor/[projectId]">) {
    const session = await verifySession();
    const userId = session.userId?.toString() ?? "";
    const role = session.role;

    const { projectId } = await props.params;
    const owned = await getProjectsForUser(userId);

    return (<>
        <Navbar role={role} currentProjectId={projectId} />
        <div className="flex flex-1 pt-14 h-full">
            {role == 'editor' 
                ? <EditorForm currentProjectId={projectId} ownedProjects={owned.map(p => ({ id: p.id, name: p.name }))} /> 
                : <UserForm currentProjectId={projectId} />}
        </div>
    </>);
}