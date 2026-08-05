import { MyNode, Data } from "@/app/page";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const openExistingDiagram = async (data: Data) => {
    try {
        const response = await fetch(`${BASE_URL}/api/quests`);
        if (!response.ok) throw new Error('Failed to fetch quests');
        const { quests }: { quests: MyNode[] } = await response.json();
        const dataNew: Data = JSON.parse(JSON.stringify(data));
        dataNew.nodes.splice(0);
        dataNew.links.splice(0);
        quests.forEach(quest => {
            dataNew.nodes.push({
                name: quest.name,
                category: quest.category,
                deps: quest.deps
            });
        });
        return { success: true, data: dataNew };
    } catch (error) {
        return { success: false, error: error };
    }
};

export const toJSON = (blobData: string, filename: string) => {
    const blob = new Blob([blobData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};