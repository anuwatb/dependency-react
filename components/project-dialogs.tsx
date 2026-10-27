import { useProjectActions } from "@/hooks/use-project-actions";

type ProJectDialogProps = ReturnType<typeof useProjectActions>

export default function ProjectDialogs ({
    dialogType,
    activeProject,
    name,
    projectId,
    close,
    handleNameChange,
    submit,
}: ProJectDialogProps) {
    return (<>
        <div className={dialogType == "create" ? "" : "hidden"}>
            <div className="dialog-content">
                <div className="dialog-header">
                    <div className="dialog-title leading-none">New Diagram</div>
                    <div className="dialog-description text-[#808090]">Give your diagram a name.</div>
                </div>
                <input 
                    placeholder="Diagram name" 
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)} 
                />
                <p className="text-xs text-[#808090]">{projectId}</p>
                <button onClick={submit}>Create Diagram</button>
                <button onClick={close}>Close</button>
            </div>
        </div>
        <div className={dialogType == "delete" ? "" : "hidden"}>
            <div className="dialog-content">
                <div className="dialog-header">
                    <div className="dialog-title leading-none">Delete Diagram</div>
                    <div className="dialog-description text-[#808090]">
                        Are you sure you want to delete "{activeProject?.name}"? This action cannot be undone.
                    </div>
                </div>
                <button onClick={submit}>Delete Diagram</button>
                <button onClick={close}>Close</button>
            </div>
        </div>
    </>);
}