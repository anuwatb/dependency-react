'use client';

import ProjectDialogs from "@/components/project-dialogs";
import ProjectSidebar from "@/components/project-sidebar";
import { ProjectRow, useProjectActions } from "@/hooks/use-project-actions";

export default function EditorHome({ ownedProjects }: { ownedProjects: ProjectRow[] }) {
    const projectActions = useProjectActions();

    return (<>
        <ProjectDialogs {...projectActions} />
        <ProjectSidebar 
            ownedProjects={ownedProjects}
            onNewDiagram={projectActions.openCreate}
            onDelete={projectActions.openDelete} 
        />

        <main className="flex-1 bg-surface flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-xl text-[#f0f0f4]">Create a diagram or open an existing one</h1>
                <button 
                    className="bg-primary text-on-primary font-mono-label font-bold px-2.5 py-2.5 rounded-lg" 
                    onClick={projectActions.openCreate}
                >
                    New Diagram
                </button>
            </div>
        </main>
    </>);
}