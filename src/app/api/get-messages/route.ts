import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// endpoint that returns all messages for a chat
export async function POST(req: Request) {
  try {
    // fetch messages from database
    const { chatId } = await req.json();
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));

    // return messages
    return NextResponse.json(userMessages);
  } catch (error) {
    console.error("error fetching messages", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
