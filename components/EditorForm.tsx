'use client';

import { useState } from "react";
import Image from "next/image";
import { Data } from "@/app/page";
import { createSankey, openExistingDiagram, toJSON } from "@/lib/actions/diagram.actions";
import { modifyCollection } from "@/lib/actions/quest.actions";

const EditorForm = (data: Data) => {
    const [name, setName] = useState('');
    const [nameNew, setNameNew] = useState('');
    const [deps, setDeps] = useState('');
    const [form, setForm] = useState('add');
    // const [addDisabled, setAddDisabled] = useState(true);
    const [dropdown, setDropdown] = useState(false);
    
    // useEffect(() => {
    //     if (name == '' || deps == '') setAddDisabled(true);
    //     else setAddDisabled(false);
    // }, [name, deps]);
    
    const handleOpen = async () => {
        // alert('The unsaved diagram will be deleted');
        await openExistingDiagram(data);
        createSankey('editor', data, { setForm, setName, setNameNew, setDeps });
    };
    
    const handleAdd = () => {
        const depsArray = deps.split(',');
        depsArray.forEach((dep, i) => {
            const nodeIndex = data.nodes.findIndex(node => node.name == name);
            const depIndex = data.nodes.findIndex(node => node.name == dep);

            if (nodeIndex == -1 && depIndex == -1) {
                data.nodes.push({ name: name, category: "Test", deps: [depsArray[i]] });
                data.nodes.push({ name: depsArray[i], category: "Test", deps: [] });
                data.links.push({ source: depsArray[i], target: name, value: 1 });
            }
            if (nodeIndex == -1 && depIndex != -1) {
                data.nodes.push({ name: name, category: "Test", deps: [depsArray[i]] });
                data.links.push({ source: depsArray[i], target: name, value: 1 });
            }
            if (nodeIndex != -1 && depIndex == -1) {
                data.nodes.push({ name: depsArray[i], category: "Test", deps: [] });
                data.nodes[nodeIndex].deps.push(depsArray[i]);
                data.links.push({ source: depsArray[i], target: name, value: 1 });
            }
            if (nodeIndex != -1 && depIndex != -1) {
                if (!data.nodes[nodeIndex].deps.includes(depsArray[i])) {
                    data.nodes[nodeIndex].deps.push(depsArray[i]);
                    data.links.push({ source: depsArray[i], target: name, value: 1 });
                }// else { alert('Already exist.'); break; }
            }
        });
        setName('');
        setDeps('');
        createSankey('editor', data, { setForm, setName, setNameNew, setDeps });
    };

    const handleEdit = (nameNew: string) => {
        data.nodes.forEach(node => {
            if (node.name == name) node.name = nameNew;
            node.deps.forEach((dep, i) => {
                if (dep == name) node.deps[i] = nameNew;
            });
        });
        data.links.forEach(link => {
            if (link.target == name) link.target = nameNew;
            if (link.source == name) link.source = nameNew;
        });
        setName('');
        setNameNew('');
        setDeps('');
        setForm('add');
        createSankey('editor', data, { setForm, setName, setNameNew, setDeps });
    };

    const handleCancel = () => {
        setName('');
        setNameNew('');
        setDeps('');
        setForm('add');
    };
    
    const handleDelete = () => {
        const nodeIndex = data.nodes.findIndex(node => node.name == name);
        if (form == 'edit') {
            data.nodes.splice(nodeIndex, 1);
            data.nodes.forEach((node) => {
                node.deps = node.deps.filter(dep => dep != name);
                const linkIndex = data.links.findIndex(link => link.source == name && link.target == node.name);
                if (linkIndex != -1) data.links.splice(linkIndex, 1);
            });
            const depsArray = deps.split(',');
            depsArray.forEach(dep => {
                const linkIndex = data.links.findIndex(link => link.source == dep && link.target == name);
                if (linkIndex != -1) data.links.splice(linkIndex, 1);
            });
        }
        if (form == 'delete') {
            data.nodes[nodeIndex].deps = data.nodes[nodeIndex].deps.filter(dep => dep != deps);
            const linkIndex = data.links.findIndex(link => link.source == deps && link.target == name);
            data.links.splice(linkIndex, 1);
        }
        setName('');
        setNameNew('');
        setDeps('');
        setForm('add');
        createSankey('editor', data, { setForm, setName, setNameNew, setDeps });
    };
    
    const handleUpload = () => {
        modifyCollection(data.nodes);
        // successfully uploaded
    };
    
    const handleDownload = () => {
        const blobData = JSON.stringify(data.nodes);
        toJSON(blobData, "data.json");
    };
    
    const actions = [
        { id: 'upload', label: 'UPLOAD TO MONGODB', execute: handleUpload },
        { id: 'download', label: 'DOWNLOAD AS TEXT FILE', execute: handleDownload }
    ];
    const [currentAction, setCurrentAction] = useState(actions[0]);

    return (<>
        <div className="px-gutter">
            <div 
                className="p-3 rounded-xl border border-outline-variant"
                onClick={handleOpen}
            >
                <span className="font-mono-label text-mono-label text-on-surface">Genshin Impact Quests</span>
            </div>
        </div>
        <div id="node-input" className="p-gutter space-y-4">
            <input
                disabled={form == 'delete'}
                type="text"
                value={form == 'edit' ? nameNew : name}
                onChange={e => form == 'edit' ? setNameNew(e.target.value) : setName(e.target.value)}
                placeholder="Name"
            />
            <input
                disabled={form == 'edit' || form == 'delete'}
                type="text"
                value={deps}
                onChange={e => setDeps(e.target.value)}
                placeholder="Depend on"
            />
        </div>
        <div className="p-gutter border-t border-outline-variant grid grid-cols-2 gap-3">
            {form == 'add' && (
                <button
                    disabled={(name == '' || deps == '') ? true : false}
                    className="col-span-2 btn-normal disabled:opacity-65 disabled:cursor-not-allowed"
                    onClick={handleAdd}
                >
                    ADD
                </button>
            )}
            {form == 'edit' && (
                <button
                    className="btn-normal"
                    onClick={() => handleEdit(nameNew)}
                >
                    EDIT NAME
                </button>
            )}
            {(form == 'edit' || form == 'delete') && (<>
                <button
                    id="delete-btn"
                    disabled={form == 'edit' ? nameNew != name : false}
                    className={form == 'edit' ? "disabled:opacity-65 disabled:cursor-not-allowed" : "col-span-2"}
                    onClick={handleDelete}
                >
                    DELETE
                </button>
                <button
                    className="col-span-2 btn-normal"
                    onClick={handleCancel}
                >
                    CANCEL
                </button>
            </>)}
        </div>
        <div className="px-6 py-4">
            <div className="relative inline-flex">
                <button
                    id="download-btn"
                    className="rounded-l-lg"
                    onClick={currentAction.execute}
                >
                    {currentAction.label}
                </button>
                <button
                    className="rounded-r-lg bg-primary px-3 hover:opacity-90"
                    onClick={() => setDropdown(!dropdown)}
                >
                    <Image src="/keyboard_arrow_down.svg" alt="" width={22} height={22} />
                </button>
                {dropdown && (
                    <div className="absolute top-full rounded-lg bg-primary">
                        {actions.map(action => (<button
                            key={action.id}
                            className="block text-left p-2 font-mono-label text-mono-label hover:opacity-90"
                            onClick={() => { setCurrentAction(action); setDropdown(false); }}
                        >
                            {action.label}
                        </button>))}
                    </div>
                )}
            </div>
        </div>
    </>);
};

export default EditorForm;