import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

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
                    placeholder: "Enter your password",
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

                    const passwordMatch = await bcrypt.compare(
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.acceptMessages = user.acceptMessages;
            }
            if (
                (account?.provider === "github" ||
                    account?.provider === "google") &&
                profile
            ) {
                const { email } = profile;

                if (email?.endsWith("@gmail.com")) {
                    try {
                        await dbConnect();
                        const foundUser = await UserModel.findOne({ email });

                        token._id = foundUser?._id.toString();
                        token.username = foundUser?.username;
                        token.isVerified = foundUser?.isVerified;
                        token.acceptMessages = foundUser?.acceptMessages;
                    } catch (error) {
                        console.error("Error signing in with Google", error);
                        throw new Error("Error signing in with Google");
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            // console.log(session);
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.acceptMessages = token.acceptMessages;
            }
            return session;
        },
        async signIn({ account, profile }) {
            if (
                (account?.provider === "github" ||
                    account?.provider === "google") &&
                profile
            ) {
                const { email, name } = profile;
                if (email?.endsWith("@gmail.com")) {
                    try {
                        await dbConnect();
                        let foundUser = await UserModel.findOne({ email });

                        if (!foundUser) {
                            const randomNum = Math.floor(
                                100 + Math.random() * 900
                            ).toString();
                            const username = name?.split(" ").join("-").concat(randomNum);
                            const new_user = new UserModel({
                                username,
                                email,
                                isVerified: true,
                                acceptMessages: true,
                            });

                            await new_user.save({ validateBeforeSave: false });
                        }

                        return true;
                    } catch (error) {
                        console.error("Error signing in with Google", error);
                        throw new Error("Error signing in with Google");
                    }
                }
                return false;
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
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
