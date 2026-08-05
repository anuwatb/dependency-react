'use client';

import { useEffect, useState } from "react";
import { Data, Status } from "@/app/page";
import Sankey from "@/components/Sankey";
import { openExistingDiagram, toJSON } from "@/lib/actions/diagram.actions";

const UserForm = () => {
    const [data, setData] = useState<Data>({ nodes: [], links: [] });
    useEffect(() => {
        openExistingDiagram(data)
            .then(result => {
                if (result.success) {
                    const dataNew: Data = JSON.parse(JSON.stringify(result.data!));
                    if (dataNew.nodes[0] && !Object.hasOwn(dataNew.nodes[0], 'status')) dataNew.nodes.forEach(node => node.status = false);
    
                    if (result.data!.links.length == 0) {
                        dataNew.nodes.forEach(node => {
                            node.deps.forEach(dep => {
                                dataNew.links.push({
                                    source: dep,
                                    target: node.name,
                                    value: 1
                                });
                            });
                        });
                    }
                    setData(dataNew);
                }
                else alert(result.error);
            });
    }, []);
    
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const progressFile = e.target.files;
        let status: Status[];
        try {
            if (progressFile) status = JSON.parse(await progressFile[0].text());
        } catch (e) {
            alert('Invalid file.');
            return;
        }
        const dataNew: Data = JSON.parse(JSON.stringify(data));
        dataNew.nodes.forEach(node => {
            const statusIndex = status.findIndex(item => item.node == node.name);
            node.status = status[statusIndex].status;
        });
        setData(dataNew);
    };
    
    const editStatus = (name: string) => {
        const dataNew: Data = JSON.parse(JSON.stringify(data));
        const nodeIndex = dataNew.nodes.findIndex(node => node.name == name);
        dataNew.nodes[nodeIndex].status = !dataNew.nodes[nodeIndex].status;
        setData(dataNew);
    };

    const handleDownloadStatus = () => {
        const status = data.nodes.map(node => ({ node: node.name, status: node.status }));
        const blobData = JSON.stringify(status);
        toJSON(blobData, "status.json");
    };
    
    return (<>
        <main id="diagram" className="flex-1 bg-surface">
            <Sankey role='user' data={data} sankeyProps={{ editStatus }} />
        </main>
        <aside>
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
        </aside>
    </>);
};

export default UserForm;