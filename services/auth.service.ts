import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "@/config/database";
import { users } from "@/models/user.model";

export const authenticateUser = async ({ email, password }: { email: string, password: string }) => {
    try {
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
        const isPasswordValid = await bcrypt.compare(password, existingUser.password || 'Dummy password');
        
        return (existingUser && isPasswordValid) ? {
            role: existingUser.role
        } : {
            message: 'Invalid email or password.'
        };
    } catch (e) {
        throw e;
    }
};