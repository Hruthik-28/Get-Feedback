import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";

export async function POST (request: Request) {
    await dbConnect();
    try {
        const { content, username } = await request.json();

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        // check if user accepting messages
        if (!user.acceptMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages currently",
                },
                { status: 403 }
            );
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        };

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "message sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "Failed to send message to user",
            },
            { status: 500 }
        );
    }
}
