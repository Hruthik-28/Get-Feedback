import { Message } from "@/models/user.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    acceptMessages?: boolean;
    messages?: Array<Message>;
}
