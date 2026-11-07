import Link from "next/link";
import Image from "next/image";
import { SankeyNode, SankeyLink } from "d3-sankey";
import Navbar from "@/components/navbar";
import { verifySession } from "@/middleware/auth.middleware";
import { getAllProjects } from "@/lib/projects";

export interface MyNode extends SankeyNode<object, object> {
    name: string;
    category: string;
    deps: string[];
    fullname: string;
    details: string;
    status?: boolean;
}

export interface Data {
    nodes: MyNode[];
    links: SankeyLink<object, object>[];
}

export default async function Page() {
    const session = await verifySession();
    const role: string = session.role;
    const projects = await getAllProjects();
    
    return (<>
        <Navbar role={role} />
        <main className="pt-14 min-h-screen bg-surface">
            <div className="p-margin">
                <header className="mb-8">
                    <h1 className="font-display-lg text-display-lg text-on-surface">Available Diagrams</h1>
                </header>
                <div className="grid xl:grid-cols-3 gap-gutter">
                    {projects.map(project => (
                        <Link 
                            key={project.id}
                            href={`/editor/${project.id}`} 
                            className="border border-outline-variant bg-surface-container hover:border-primary rounded-xl"
                        >
                            <div className="aspect-video bg-surface-dim overflow-hidden">
                                <Image src="/flowchart.svg" alt="" width={512} height={512} />
                            </div>
                            <div className="p-4">
                                <h4 className="font-body-base font-bold text-on-surface mb-1">{project.name}</h4>
                                <p className=""></p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    </>)
}