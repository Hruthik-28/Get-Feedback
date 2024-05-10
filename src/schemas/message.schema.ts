import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, "content must atleast 10 characters")
        .max(1000, "content must be max 1000 characters"),
});
