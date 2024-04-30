import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const messageId = new URL(request.url).searchParams.get("messageId");

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

        const foundUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    messages: {
                        _id: messageId,
                    },
                },
            },
            { new: true }
        );

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
                message: "Message deleted Successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Failed to delete message",
            },
            { status: 500 }
        );
    }
}
