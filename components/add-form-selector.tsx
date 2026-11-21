import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

interface AddFormSelectorProps {
    form: string;
    setForm: Dispatch<SetStateAction<string>>;
}

export default function AddFormSelector({ form, setForm }: AddFormSelectorProps) {
    const [addingDropdown, setAddingDropdown] = useState(false);

    const addingActions = [
        { id: 'add', label: 'Add Node with Dependencies' },
        { id: 'add-dep', label: 'Add Dependency Only' },
    ];
    
    return (<>
        <div className="w-full relative inline-flex">
            <div className="w-full px-8 py-2 border-b border-outline-variant text-[#f0f0f4] font-mono-label text-mono-label">
                {addingActions[addingActions.findIndex(action => action.id == form)].label}
            </div>
            <button
                className="bg-primary px-3 hover:opacity-90"
                onClick={() => setAddingDropdown(!addingDropdown)}
            >
                <Image src="/keyboard_arrow_down.svg" alt="" width={22} height={22} />
            </button>
            {addingDropdown && (
                <div className="absolute top-full rounded-lg bg-primary">
                    {addingActions.map(action => (<button
                        key={action.id}
                        className="w-full block text-left p-2 font-mono-label text-mono-label hover:opacity-90"
                        onClick={() => { setForm(action.id); setAddingDropdown(false); }}
                    >
                        {action.label}
                    </button>))}
                </div>
            )}
        </div>
    </>);
}