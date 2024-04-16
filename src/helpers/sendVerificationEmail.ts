import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVericationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: email,
            subject: "GetFeedback | Verify your email",
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending verication email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}
