import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

// endpoint that returns all messages for a chat
export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();

    // try to fetch messages from redis cache
    const cachedData = await redis.get(chatId.toString());
    if (cachedData) {
      console.log("serving from cache");
      return NextResponse.json(JSON.parse(cachedData));
    }

    // if not in cache, fetch messages from database
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));

    // store results in redis with 1 hr expiry
    console.log("storing to cache");
    await redis.set(chatId.toString(), JSON.stringify(userMessages), {
      EX: 3600,
    });

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
