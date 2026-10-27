import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey, SankeyLink, sankeyLinkHorizontal } from "d3-sankey";
import { MyNode, Data } from "@/app/page";
import Tooltip, { TooltipData } from "./tooltip";

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
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
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
        if (!svgRef.current) return;

        const width = parseInt(d3.select("#diagram").style("width"));
        const height = parseInt(d3.select("#diagram").style("height"));
        
        const svg = d3.select(svgRef.current)
                .attr("width", width)
                .attr("height", height);
        svg.selectAll("*").remove();
        if (data.links.length == 0) return;//data.nodes.length == 0 || 
        const diagram = sankey<MyNode, SankeyLink<object, object>>()
            .nodeId(d => d.name)
            .extent([[20, 20], [width - 20, height - 20]]);
        const { nodes, links } = diagram({
            nodes: JSON.parse(JSON.stringify(data.nodes)),
            links: JSON.parse(JSON.stringify(data.links))
        });
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const g = svg.append("g");
        const link = g.append("g")
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
        // Append after links to avoid being overlapped under links making them unclickable
        g.append("g")
            .selectAll("rect")
            .data(nodes)
            .join("rect")
                .attr("data-testid", d => `node-${d.name}`)
                .attr("stroke", "#000")
                .attr("x", d => d.x0!)
                .attr("y", d => d.y0!)
                // If orphan node, i.e. d.y1 == d.y0, use fixed height of 30 to make it more visible
                .attr("height", d => d.y1! == d.y0! ? 30 : d.y1! - d.y0!)
                .attr("width", d => d.x1! - d.x0!)
                .attr("fill", d => color(d.category))
                // Hover for details
                .on("mouseover", (_e, d) => (role == 'user') && setTooltip({
                    fullname: d.fullname,
                    category: d.category,
                    details: d.details,
                    x: d.x1!,
                    y: d.y0!,
                }))
                .on("click", (e, d) => role == 'editor' ? toEditNode(d.name, d.category, d.deps, d.fullname, d.details) : editStatus!(d.name));
        const maxDepth =  d3.max(nodes, d => d.depth);
        g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
                // Use d.name, not fullname, and maxDepth to avoid text overlapping problem
                .text(d => d.name)// d.fullname || 
                .attr("data-testid", d => `node-text-${d.name}`)
                .attr("x", d => d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6)
                // If orphan node, i.e. d.y1 == d.y0, its height will be 30 so adjust text's y accordingly
                .attr("y", d => d.y1! == d.y0! ? ((d.y0! + d.y1!) / 2) + 15 : (d.y0! + d.y1!) / 2)
                .attr("text-anchor", d => d.x0! < width / 2 ? "start" : "end")
                .attr("font-size", `${1 / (maxDepth! / 3)}em`)
                .attr("fill", "#dae2fd");
        g.append("g")
            .selectAll("image")
            .data(nodes.filter(d => d.status == true))
            .join("image")
                .attr("href", "/check_circle.svg")
                .attr("x", d => d.x0!)
                .attr("y", d => ((d.y0! + d.y1!) / 2) - 12)
                .on("click", (_e, d) => editStatus!(d.name));

        const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            const { transform } = event;
            g.attr("transform", transform.toString());
        };

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 8])
            .on("zoom", zoomed);
        
        svg.call(zoom);
        console.log(data);
    }, [data]);
    return (<>
        <svg ref={svgRef} data-testid="svg" data-testdata={JSON.stringify(data)} />
        {tooltip && <Tooltip role={role} tooltip={tooltip} setTooltip={setTooltip} />}
    </>);
};
    
export default Sankey;