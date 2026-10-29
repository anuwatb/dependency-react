'use server';

import { eq } from "drizzle-orm";
import { db } from "@/config/database";
import { projects } from "@/models/project.model";
import connectDB from "../mongodb";
import { NodeSchema } from "@/database/quest.model";

export const modifyCollection = async (documents: object[], projectId: string) => {
    const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
    const clusterConnection = await connectDB();

    const projectDb = clusterConnection.useDb(project.database, { useCache: true });

    const Node = projectDb.model('Node', NodeSchema);
        
    await Node.deleteMany({});
    try {
        await Node.create(documents);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to upload' };
    }
};