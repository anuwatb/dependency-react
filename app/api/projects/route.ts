import { verifySession } from "@/middleware/auth.middleware";
import { db } from "@/config/database";
import { projects } from "@/models/project.model";

export async function POST(request: Request) {
    const { userId } = await verifySession();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await request.json();
    const name = body.name || "Untitled Project";
    
    await db.insert(projects).values({
        id: body.id,
        ownerId: userId.toString(),
        name: name,
        database: body.id,
    });
    
    return Response.json({  }, { status: 201 });
}