import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { openai } from "@ai-sdk/openai";
import { Message, streamText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

// endpoint that handles user message and generates ai responses
export async function POST(req: Request) {
  try {
    // gets message and chat from request
    const { messages, chatId } = await req.json();
    const userChats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (userChats.length != 1) {
      console.error("chat not found");
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    // context retrieval using message and file
    const fileKey = userChats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    // system prompt to define ai behaviour
    const prompt = {
      role: "system",
      content: `You are an AI assistant specialized in summarizing documents. 
      Your goal is to help users by providing clear, concise, and insightful summaries of their documents. 
      You are knowledgeable, helpful, and articulate, always aiming to enhance the user's understanding of the material.
      You are friendly, kind, and eager to assist with any questions or clarifications the user may have.
      You will use the provided context to generate accurate and relevant responses.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      `,
      // content: `You are an AI assistant specialized in summarizing and organizing notes.
      // Your goal is to help users by providing clear, concise, and insightful summaries of their notes.
      // You are knowledgeable, helpful, and articulate, always aiming to enhance the user's understanding of the material.
      // You are friendly, kind, and eager to assist with any questions or clarifications the user may have.
      // You will use the provided context to generate accurate and relevant responses.
      // START CONTEXT BLOCK
      // ${context}
      // END OF CONTEXT BLOCK
      // If the context does not provide the answer to a question, you will say, "I'm sorry, but I don't have enough information to answer that question."
      // You will not invent information that is not drawn directly from the context.
      // `,
    };

    // stream the ai response while inserting messages into database
    const response = streamText({
      model: openai("gpt-4o"),
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      onStepFinish: async (result) => {
        // insert user and ai messages into db
        console.log("updated db chat messages");
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });
        await db.insert(_messages).values({
          chatId,
          content: result.text,
          role: "system",
        });

        // invalidating cached chat messages
        console.log("invalidating cached chat messages");
        await redis.del(chatId.toString());
      },
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("error sending message", error);
    return NextResponse.json(
      {
        error: "internal server error",
      },
      { status: 500 }
    );
  }
}
