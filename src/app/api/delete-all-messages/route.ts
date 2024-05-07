import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/models/user.model";

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as User;

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized Request. Please login",
                },
                { status: 401 }
            );
        }

        const foundUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    messages: [],
                },
            },
            { new: true }
        );

        if (foundUser?.messages.length !== 0) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to delete all messages",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "All messages deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to delete. Internal Server Error",
            },
            { status: 500 }
        );
    }
}
