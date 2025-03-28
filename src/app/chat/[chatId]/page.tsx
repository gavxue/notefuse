import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Viewer from "@/components/Viewer";
import Chat from "@/components/Chat";

type Props = {
  params: {
    chatId: string;
  };
};

async function ChatPage({ params }: Props) {
  const { chatId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  if (!userChats || userChats.length === 0) {
    return redirect("/");
  }

  const currentChat = userChats.find((chat) => chat.id == parseInt(chatId));

  if (!currentChat) {
    return redirect("/");
  }

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <Sidebar chats={userChats} chatId={parseInt(chatId)} />
        </div>
        <div className="flex-[5] max-h-screen p-4 overflow-scroll">
          <Viewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        <div className="flex-[3] border-1-4 border-1-slate-200">
          <Chat chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
