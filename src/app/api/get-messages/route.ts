import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { chatId } = await req.json();
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));

    return NextResponse.json(userMessages);
  } catch (error) {
    console.error("error fetching messages", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};
