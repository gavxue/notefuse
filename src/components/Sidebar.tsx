"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  MessageCircle,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

export default function LeftSidebar({ chats, chatId }: Props) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                X
              </div>
              <span className="truncate font-semibold">Notefuse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSub>
                {chats.map((chat) => (
                  <SidebarMenuSubItem key={chat.id}>
                    <SidebarMenuSubButton asChild>
                      <Link key={chat.id} href={`/chat/${chat.id}`} className="truncate">
                        {chat.pdfName}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
                <SidebarMenuSubItem>
                  <Button variant="outline" className="w-full truncate" asChild>
                    <Link href="/">
                      <PlusCircle className="mr-2 w-4 h-4" />
                      New Chat
                    </Link>
                  </Button>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Gavin Xue</span>
                    <span className="truncate text-xs">gavin@gmail.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Gavin Xue</span>
                      <span className="truncate text-xs">gavin@gmail.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    // <div className="w-full h-screen p-4 m-4 text-white bg-zinc-800">
    //   <Link href="/">
    //     <Button className="w-full border-dashed border-white border">
    //       <PlusCircle className="mr-2 w-4 h-4" />
    //       New Chat
    //     </Button>
    //   </Link>

    //   <div className="flex flex-col gap-2 mt-4">
    //     {chats.map((chat) => (
    //       <Link key={chat.id} href={`/chat/${chat.id}`}>
    //         <div
    //           className={cn("rounded-lg p-3 flex items-center", {
    //             "bg-blue-600 text-white": chat.id === chatId,
    //             "hover:text-white": chat.id !== chatId,
    //           })}
    //         >
    //           <MessageCircle className="mr-2" />
    //           <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
    //             {chat.pdfName}
    //           </p>
    //         </div>
    //       </Link>
    //     ))}
    //   </div>
    //   <div className="absolute bottom-4 left-4">
    //     <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
    //       <Link href="/">Home</Link>
    //       <Link href="/">Source</Link>
    //     </div>
    //   </div>
    // </div>
  );
}
