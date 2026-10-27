import { useState } from "react";
import { redirect } from "next/navigation";

export interface ProjectRow {
    id: string;
    name: string;
}

type DialogType = "create" | "delete" | null;

const toSlug = (name: string) => {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const shortSuffix = () => {
    return Math.random().toString(36).slice(2, 6);
};

export const useProjectActions = () => {
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [activeProject, setActiveProject] = useState<ProjectRow | null>(null);
    const [name, setName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [suffix, setSuffix] = useState("");
    
    const openCreate = () => {
        setSuffix(shortSuffix());
        setName("");
        setDialogType("create");
    };

    const openDelete = (project: ProjectRow) => {
        setActiveProject(project);
        setDialogType("delete");
    };
    
    const close = () => {
        setDialogType(null);
        setName("");
        setProjectId("");
    };
    
    const handleNameChange = (value: string) => {
        setName(value);
        const s = toSlug(value);
        setProjectId(s ? `${s}-${suffix}` : "");
    };
    
    const submit = async () => {
        try {
            if (dialogType == "create") {
                const projectId = `${toSlug(name)}-${suffix}`;
                const res = await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: projectId, name: name }),
                });
                if (res.ok) {
                    setDialogType(null);
                    setName("");
                    redirect('/');
                }
            } else if (dialogType == "delete" && activeProject) {
                await fetch(`/api/projects/${activeProject.id}`, { method: "DELETE" });
                setDialogType(null);
                setActiveProject(null);
                // Problem: The deleted diagram is still on the screen
                redirect('/');
            }
        } finally {

        }
    };
    
    return {
        dialogType,
        activeProject,
        name,
        projectId,
        openCreate,
        openDelete,
        close,
        handleNameChange,
        submit,
    };
};