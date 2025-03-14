import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Viewer from "@/components/Viewer";
import Chat from "@/components/Chat";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LeftSidebar from "@/components/Sidebar";

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
    <SidebarProvider>
      <LeftSidebar chats={userChats} chatId={parseInt(chatId)} />
      <SidebarInset>
          <div className="flex h-full">
            <SidebarTrigger className="ml-1" />
            {/* <div className="flex-[1] max-w-xs">
              <Sidebar chats={userChats} chatId={parseInt(chatId)} />
            </div> */}
            <div className="flex-[1]">
              <Chat chatId={parseInt(chatId)} />
            </div>
            <div className="flex-[1]">
              <Viewer pdf_url={currentChat?.pdfUrl || ""} />
            </div>
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ChatPage;
