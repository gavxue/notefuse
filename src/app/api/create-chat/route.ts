import { db } from "@/lib/db/index";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// endpoint that creates a new chat for the use upon pdf submission
export async function POST(req: Request, res: Response) {
  // check if user is authorized
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // loads the document in vector database
    const { file_key, file_name } = await req.json();
    await loadS3IntoPinecone(file_key);

    // insert the chat info into database
    const chat = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: userId,
      })
      .returning({
        id: chats.id,
      });

    // return the chat id
    return NextResponse.json(
      {
        chat_id: chat[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error creating chat", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
