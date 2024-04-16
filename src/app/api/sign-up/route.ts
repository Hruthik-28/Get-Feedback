import dbConnect from "@/lib/dbConnect";
import bcrypt, { hash } from "bcryptjs";
import { sendVericationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/models/user.model";
import generateVerificationCode from "@/helpers/generateVerificationCode";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const exisitingUserWithVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (exisitingUserWithVerifiedUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        const exisitingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = generateVerificationCode().toString();

        if (exisitingUserByEmail) {
            if (exisitingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User with email already exists",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const verifyCodeExpiry = new Date(Date.now() + 3600000);

                await UserModel.findByIdAndUpdate(exisitingUserByEmail._id, {
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry,
                });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date(Date.now() + 3600000);

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                acceptMessages: true,
            });
        }

        const emailResponse = await sendVericationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }
        
        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully. Please verify your email",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}
