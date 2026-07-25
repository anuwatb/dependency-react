'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signInSchema } from "@/validations/auth.validation";
import { authenticateUser } from "@/services/auth.service";
import { jwttoken } from "@/utils/jwt";

export const signIn = async (formData: FormData) => {
    // Validate form fields
    const validatedFileds = signInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    
    if (!validatedFileds.success) {
        return;
    }
    
    const { email, password } = validatedFileds.data;
    
    const user = await authenticateUser({ email: email, password: password });
    
    // Create user session
    const token = jwttoken.sign({
        role: user.role,
    });
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
        httpOnly: true,
        sameSite: 'strict',
    });
    
    redirect('/');
};

export const signOut = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('token');
};