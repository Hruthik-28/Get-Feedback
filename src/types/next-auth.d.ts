import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        acceptMessages?: string;
    }
    interface Session {
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            acceptMessages?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            acceptMessages?: string;
        };
    }
}
