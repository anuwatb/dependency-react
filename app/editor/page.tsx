import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import EditorHome from "@/components/editor-home";
import { verifySession } from "@/middleware/auth.middleware";
import { getProjectsForUser } from "@/lib/projects";

export default async function EditorPage() {
    // To do: Add a user mode for editors
    const session = await verifySession();
    const role = session.role;
    if (!session.userId) redirect("/signin");

    const owned = await getProjectsForUser(session.userId.toString());
    
    return (<>
        <Navbar role={role} />
        <div className="flex flex-1 pt-14 h-full">
            <EditorHome ownedProjects={owned.map(p => ({ id: p.id, name: p.name }))} />
        </div>
    </>);
}