import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export async function POST(req: Request) {
  const { promptInput } = await req.json();

  const prompt = `Create a list of three open-ended and engaging questions formatted as a single string.
Each question should be separated by '||'.
These questions are for an anonymous social messaging platform, like reddit.
Avoid personal or sensitive topics, focusing on universal themes that encourage friendly interaction.

User input (randomizer): ${promptInput}.
Make sure the suggestions are **different from previous ones**.`;

  try {
    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      prompt,
      temperature: 1, // 1 adds max randomness
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error?.message || "Error getting response from Google AI",
        error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
