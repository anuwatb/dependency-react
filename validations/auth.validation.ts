import z from "zod";

export const signInSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email({ error: 'Please enter a valid email.' })),
    password: z.string().min(1, { error: 'Please enter your credential key.' }),
});