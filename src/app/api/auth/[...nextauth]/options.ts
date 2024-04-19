import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Enter your email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your  password",
                },
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error(
                            "User with provided email doesn't exist"
                        );
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            "Please verify your email before login"
                        );
                    }

                    const passwordMatch = bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!passwordMatch) {
                        throw new Error("Incorrect Password");
                    }

                    return user;
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.acceptMessages = user.acceptMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token.user._id;
                session.user.username = token.user.username;
                session.user.isVerified = token.user.isVerified;
                session.user.acceptMessages = token.user.acceptMessages;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
};
