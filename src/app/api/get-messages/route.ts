import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized access. Please sign-in",
                },
                { status: 401 }
            );
        }

        const foundUser = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user._id),
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: { "messages.createdAt": -1 },
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages",
                    },
                },
            },
        ]);

        if (!foundUser || foundUser.length == 0) {
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
                messages: foundUser[0]?.messages,
                message: "Messages fetched successfully"
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Failed to fetch messages from user",
            },
            { status: 500 }
        );
    }
}
