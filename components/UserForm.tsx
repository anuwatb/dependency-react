'use client';

// import { useEffect } from "react";
import { Data, Status } from "@/app/page";
import { createSankey, openExistingDiagram, toJSON } from "@/lib/actions/diagram.actions";

const UserForm = ({ data, status }: { data: Data, status: Status[] }) => {
    // useEffect(() => {
        openExistingDiagram(data)
            .then(() => createSankey('user', data, {}));
    // }, []);
    
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const progressFile = e.target.files;
        if (progressFile) status = JSON.parse(await progressFile[0].text());
        data.nodes.forEach(node => {
            const statusIndex = status.findIndex(item => item.node == node.name);
            node.status = status[statusIndex].status;
        });
        createSankey('user', data, {});
    };
    
    const handleDownloadStatus = () => {
        const status = data.nodes.map(node => ({ node: node.name, status: node.status }));
        const blobData = JSON.stringify(status);
        toJSON(blobData, "status.json");
    };
    
    return (<>
        <div className="px-(--gutter) space-y-1.5">
            <label htmlFor="file-input" className="font-mono-label text-[10px] text-on-surface-variant">
                OPEN PROGRESS DATA FILE
            </label>
            <input
                id="file-input"
                type="file"
                className="text-sm text-on-surface border border-outline-variant rounded-lg file:mr-4 file:px-4 file:py-2 file:bg-primary file:text-on-primary hover:file:opacity-90"
                onChange={handleFile}
            />
        </div>
        <div className="px-6 py-4">
            <button
                id="download-btn"
                className="rounded-lg"
                onClick={handleDownloadStatus}
            >
                DOWNLOAD PROGRESS DATA
            </button>
        </div>
    </>);
};

export default UserForm;