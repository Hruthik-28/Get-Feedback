import { z } from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, "Please enter your username or email"),
    password: z.string().min(1, "Please enter your password"),
});
