import { Dispatch, SetStateAction } from "react";
import * as d3 from "d3";
import { sankey, SankeyLink, sankeyLinkHorizontal } from "d3-sankey";
import { MyNode, Data } from "@/app/page";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface SetProps {
    setForm?: Dispatch<SetStateAction<string>>;
    setName?: Dispatch<SetStateAction<string>>;
    setNameNew?: Dispatch<SetStateAction<string>>;
    setDeps?: Dispatch<SetStateAction<string>>;
}

export const createSankey = (role: string, data: Data, { setForm, setName, setNameNew, setDeps }: SetProps) => {
    const toEditNode = (name: string, deps: string[]) => {
        setForm!('edit');
        setName!(name);
        setNameNew!(name);
        setDeps!(deps.join());
    };
    
    const toDelete = (source: string, target: string) => {
        setForm!('delete');
        setName!(target);
        setDeps!(source);
    };
    
    const editStatus = (name: string) => {
        const nodeIndex = data.nodes.findIndex(node => node.name == name);
        data.nodes[nodeIndex].status = !data.nodes[nodeIndex].status;
        createSankey('user', data, {});
    };

    if (role != 'editor' && !Object.hasOwn(data.nodes[0], 'status')) data.nodes.forEach(node => node.status = false);
    
    if (data.links.length == 0) {
        data.nodes.forEach(node => {
            node.deps.forEach(dep => {
                data.links.push({
                    source: dep,
                    target: node.name,
                    value: 1
                });
            });
        });
    }
        
    const width = parseInt(d3.select("#diagram").style("width"));
    const height = parseInt(d3.select("#diagram").style("height"));
        
    d3.select("svg").remove();
    if (data.links.length == 0) return;//data.nodes.length == 0 || 
    const svg = d3.select("#diagram")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    const diagram = sankey<MyNode, SankeyLink<object, object>>()
        .nodeId(d => d.name)
        .extent([[0, 0], [width, height]]);
    const { nodes, links } = diagram({
        nodes: JSON.parse(JSON.stringify(data.nodes)),
        links: JSON.parse(JSON.stringify(data.links))
    });
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    svg.append("g")
        .selectAll("rect")
        .data(nodes)
        .join("rect")
            .attr("stroke", "#000")
            .attr("x", d => d.x0!)
            .attr("y", d => d.y0!)
            .attr("height", d => d.y1! - d.y0!)
            .attr("width", d => d.x1! - d.x0!)
            .attr("fill", d => color(d.category))
            .on("click", (e, d) => role == 'editor' ? toEditNode(d.name, d.deps) : editStatus(d.name));
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll(".link")
        .data(links)
        .join("g")
            .attr("class", "link")
            .on("click", (e, d) => (role == 'editor') && toDelete((d as { source: { name: string } }).source.name, (d as { target: { name: string } }).target.name));
    link.append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", d => color((d as { source: { category: string } }).source.category))
        .attr("stroke-width", d => d.width!);
    svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
            .text(d => d.name)
            .attr("x", d => d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6)
            .attr("y", d => (d.y0! + d.y1!) / 2)
            .attr("text-anchor", d => d.x0! < width / 2 ? "start" : "end")
            .attr("fill", "#dae2fd");
    svg.append("g")
        .selectAll("image")
        .data(nodes)
        .join("image")
            .attr("href", d => d.status == true ? "/check_circle.svg" : "")
            .attr("x", d => d.x0!)
            .attr("y", d => ((d.y0! + d.y1!) / 2) - 12);
    console.log(data);
};
    
export const openExistingDiagram = async (data: Data) => {
    try {
        const response = await fetch(`${BASE_URL}/api/quests`);
        if (!response.ok) throw new Error('Failed to fetch quests');
        const { quests }: { quests: MyNode[] } = await response.json();
        data.nodes.splice(0);
        data.links.splice(0);
        quests.forEach(quest => {
            data.nodes.push({
                name: quest.name,
                category: quest.category,
                deps: quest.deps
            });
        });
    } catch (error) {
        console.error(error);
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