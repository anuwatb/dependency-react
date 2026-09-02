import { SankeyNode, SankeyLink } from "d3-sankey";
import AccountLink from "@/components/AccountLink";
import EditorForm from "@/components/EditorForm";
import UserForm from "@/components/UserForm";
import { verifySession } from "@/middleware/auth.middleware";

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

export interface Status {
    node: string;
    status: boolean;
}

const Page = async () => {
    const session = await verifySession();
    const role: string = session.role;
    
    return (<>
        <header className="bg-surface border-b border-outline-variant fixed w-full flex items-center justify-between px-margin h-14">
            <span className="font-headline-md text-headline-md text-primary font-bold">Dependency Diagram</span>
            <div className="w-8 h-8 rounded-full border border-outline-variant cursor-pointer">
                <AccountLink role={role} />
            </div>
        </header>
        <div className="flex flex-1 pt-14 h-full">
                {role == 'editor' ? <EditorForm /> : <UserForm />}
        </div>
    </>)
};

export default Page;