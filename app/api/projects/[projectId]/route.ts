import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/database";
import { projects } from "@/models/project.model";
import connectDB from "@/lib/mongodb";
import { NodeSchema } from "@/database/quest.model";
import { verifySession } from "@/middleware/auth.middleware";

export async function GET(
    _request: NextRequest,
    ctx: RouteContext<"/api/projects/[projectId]">
) {
    const { projectId } = await ctx.params;
    const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
    
    try {
        const clusterConnection = await connectDB();

        const projectDb = clusterConnection.useDb(project.database, { useCache: true });
        
        const Node = projectDb.model('Node', NodeSchema);
        
        const nodes = await Node.find();

        return NextResponse.json({ nodes }, { status: 200 });
    } catch (_e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    ctx: RouteContext<"/api/projects/[projectId]">
) {
    const { userId } = await verifySession();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    
    const { projectId } = await ctx.params;
    const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
    if (project.ownerId != userId.toString()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        // Delete the database from MongoDB Atlas
        const clusterConnection = await connectDB();

        const projectDb = clusterConnection.useDb(project.database, { useCache: true });

        await projectDb.dropDatabase();

        // Delete the related record in Neon
        await db.delete(projects).where(eq(projects.id, projectId));

        return NextResponse.json({  }, { status: 204 });
    } catch (_e) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}