import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(5, "username must be atleast 5 characters")
    .max(24, "username cannot be more than 24 characters")
    .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, digits, hyphens, and underscores."
    );

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be atleast 8 characters" }),
});
