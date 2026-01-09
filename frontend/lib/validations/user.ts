import { z } from 'zod';

export const profileUpdateSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .regex(/^[\p{L}\p{M}\s.'-]+$/u, 'Name can only contain letters, spaces, and common punctuation (- \')'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .optional()
        .or(z.literal('')),
    password_confirmation: z.string()
        .optional()
        .or(z.literal('')),
}).refine((data) => {
    if (data.password && data.password !== data.password_confirmation) {
        return false;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
