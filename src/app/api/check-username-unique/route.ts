import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUp.schema";
import { z } from "zod";

const userNameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        // zod validation for username
        const result = userNameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors =
                result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid query parameter",
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "username is available",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Error checking unique username",
            },
            { status: 500 }
        );
    }
}
