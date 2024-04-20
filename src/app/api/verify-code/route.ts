import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { verifySchema } from "@/schemas/verify.schema";
import { z } from "zod";

const verifyCodeSchema = z.object({
    verifyCode: verifySchema,
});

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { verifyCode, username } = await request.json();

        // zod validation for verfiyCode
        const result = verifySchema.safeParse({ code: verifyCode });

        if (!result.success) {
            const verifyCodeErrors = result.error.format().code?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        verifyCodeErrors.length > 0
                            ? verifyCodeErrors.join(", ")
                            : "Invalid verification code",
                },
                { status: 400 }
            );
        }
        const { code } = result.data;

        const userToBeVerified = await UserModel.findOne({
            username,
        });

        if (!userToBeVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid username",
                },
                { status: 400 }
            );
        }

        const isCodeValid = userToBeVerified.verifyCode === verifyCode;
        const isCodeNotExpired =
            new Date(userToBeVerified.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            userToBeVerified.isVerified = true;
            await userToBeVerified.save();

            return Response.json(
                {
                    success: true,
                    message: "Account Verification successfull",
                },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Verification Code is expired. Please SignUp again to get new verification code",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: false,
                message: "Invalid Verification Code",
            },
            { status: 400 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Error verifying email",
            },
            { status: 500 }
        );
    }
}
