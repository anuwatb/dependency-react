import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "@/config/database";
import { users } from "@/models/user.model";

export const authenticateUser = async ({ email, password }: { email: string, password: string }) => {
    try {
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
        if (!existingUser) return { message: 'User not founded.' };
        
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        
        return isPasswordValid ? {
            role: existingUser.role
        } : {
            message: 'Password not valid.'
        };
    } catch (e) {
        throw e;
    }
};