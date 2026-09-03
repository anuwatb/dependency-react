import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, SankeyLink, sankeyLinkHorizontal } from "d3-sankey";
import { MyNode, Data } from "@/app/page";

interface SankeyProps {
    setForm?: Dispatch<SetStateAction<string>>;
    setName?: Dispatch<SetStateAction<string>>;
    setNameNew?: Dispatch<SetStateAction<string>>;
    setNameFull?: Dispatch<SetStateAction<string>>;
    setCategory?: Dispatch<SetStateAction<string>>;
    setDeps?: Dispatch<SetStateAction<string>>;
    setDetails?: Dispatch<SetStateAction<string>>;
    editStatus?: (name: string) => void;
}

const Sankey = ({ role, data, sankeyProps }: { role: string, data: Data, sankeyProps: SankeyProps }) => {
    const svgRef = useRef(null);
    const { setForm, setName, setNameNew, setNameFull, setCategory, setDeps, setDetails, editStatus } = sankeyProps;
    
    const toEditNode = (name: string, category: string, deps: string[], fullname: string, details: string) => {
        setForm!('edit');
        setName!(name);
        setNameNew!(name);
        setNameFull!(fullname);
        setCategory!(category);
        setDeps!(deps.join());
        setDetails!(details);
    };
    
    const toDelete = (source: string, target: string) => {
        setForm!('delete');
        setName!(target);
        setDeps!(source);
    };
    
    useEffect(() => {
        const width = parseInt(d3.select("#diagram").style("width"));
        const height = parseInt(d3.select("#diagram").style("height"));
        
        const svg = d3.select(svgRef.current)
                .attr("width", width)
                .attr("height", height);
        svg.selectAll("*").remove();
        if (data.links.length == 0) return;//data.nodes.length == 0 || 
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
                .attr("data-testid", d => `node-${d.name}`)
                .attr("stroke", "#000")
                .attr("x", d => d.x0!)
                .attr("y", d => d.y0!)
                .attr("height", d => d.y1! - d.y0!)
                .attr("width", d => d.x1! - d.x0!)
                .attr("fill", d => color(d.category))
                .on("click", (e, d) => role == 'editor' ? toEditNode(d.name, d.category, d.deps, d.fullname, d.details) : editStatus!(d.name));
        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
            .selectAll(".link")
            .data(links)
            .join("g")
                .attr("class", "link")
                .attr("data-testid", d => `link-${(d as { source: { name: string } }).source.name}-${(d as { target: { name: string } }).target.name}`)
                .on("click", (e, d) => (role == 'editor') && toDelete((d as { source: { name: string } }).source.name, (d as { target: { name: string } }).target.name));
        link.append("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke", d => color((d as { source: { category: string } }).source.category))
            .attr("stroke-width", d => d.width!);
        svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
                .text(d => d.fullname || d.name)
                .attr("data-testid", d => `node-text-${d.name}`)
                .attr("x", d => d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6)
                .attr("y", d => (d.y0! + d.y1!) / 2)
                .attr("text-anchor", d => d.x0! < width / 2 ? "start" : "end")
                .attr("fill", "#dae2fd");
        svg.append("g")
            .selectAll("image")
            .data(nodes.filter(d => d.status == true))
            .join("image")
                .attr("href", "/check_circle.svg")
                .attr("x", d => d.x0!)
                .attr("y", d => ((d.y0! + d.y1!) / 2) - 12);
        console.log(data);
    }, [data]);
    return (
        <svg ref={svgRef} data-testid="svg" data-testdata={JSON.stringify(data)} />
    );
};
    
export default Sankey;