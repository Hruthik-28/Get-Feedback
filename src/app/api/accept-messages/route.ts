import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized request. Please sign-in",
                },
                { status: 401 }
            );
        }

        const userId = user?._id;
        const { acceptMessages } = await request.json();

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                acceptMessages,
            },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to toggle accept messages",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                acceptMessages: updatedUser.acceptMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Failed to toogle accept messages status",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized request. Please sign-in",
                },
                { status: 401 }
            );
        }

        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                acceptMessages: foundUser.acceptMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Failed to get accept messages status",
            },
            { status: 500 }
        );
    }
}
