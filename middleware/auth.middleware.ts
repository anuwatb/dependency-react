import { cookies } from "next/headers";
import { jwttoken } from "@/utils/jwt";

export const verifySession = async () => {
    const cookie = (await cookies()).get('token')?.value;
    const session = jwttoken.verify(cookie);
    return session ? { role: (session as { role: string }).role } : { role: 'user' };
};