import { ProjectRow } from "@/hooks/use-project-actions";

interface ProjectSidebarProps {
    ownedProjects: ProjectRow[];
    onNewDiagram: () => void;
    onDelete: (project: ProjectRow) => void;
    currentProjectId?: string;
    handleOpen: (projectId: string) => void;
}

export default function ProjectSidebar ({
    ownedProjects, 
    onNewDiagram,
    onDelete,
    currentProjectId, 
    handleOpen
}: ProjectSidebarProps) {
    return (
        <aside className="w-64 py-gutter bg-surface-container-low border-r">
            <div className="h-12 px-4">
                <span className="text-sm text-on-surface">Projects</span>
            </div>
            <div className="px-gutter">
                <ul className="flex flex-col gap-0.5 mb-6">
                    {ownedProjects.map(project => (
                        <li key={project.id}>
                            <div className={`
                                flex rounded-xl border p-3
                                ${project.id == currentProjectId 
                                    ? "border-outline-variant bg-accent-primary-dim" 
                                    : "border-transparent hover:bg-[#1e1e23]"}
                            `}>
                                <button 
                                    className="w-full text-left"
                                    onClick={() => handleOpen(project.id)}
                                >
                                    <span className={`font-mono-label text-mono-label 
                                        ${project.id == currentProjectId ? "text-[#f0f0f4]" : "text-[#c0c0cc] hover:text-[#f0f0f4]"}
                                    `}>
                                        {project.name}
                                    </span>
                                </button>
                                <button>
                                    <span 
                                        className="text-on-surface" 
                                        onClick={() => onDelete(project)}
                                    >
                                        Delete
                                    </span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button 
                    className="w-full bg-primary text-on-primary font-bold py-2.5 rounded-lg"
                    onClick={onNewDiagram}
                >
                    <span className="font-mono-label">New Diagram</span>
                </button>
            </div>
        </aside>
    );
}