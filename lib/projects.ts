import { eq } from "drizzle-orm";
import { db } from "@/config/database";
import { projects } from "@/models/project.model";

export const getProjectsForUser = async (userId: string) => {
    const owned = await db.select().from(projects).where(eq(projects.ownerId, userId));
    
    return owned;
};