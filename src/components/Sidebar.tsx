"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  ChevronsUpDown,
  Loader2,
  LogOut,
  MessageCircle,
  MessageSquare,
  Plus,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { uploadToS3 } from "@/lib/s3";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef, useState } from "react";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

export default function LeftSidebar({ chats, chatId }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, status } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadToS3(file);
      if (!data?.file_key || !data.file_name) {
        console.error("error uploading to s3");
        toast.error("Something went wrong");
        return;
      }

      mutate(data, {
        onSuccess: ({ chat_id }) => {
          toast.success("Chat created!");
          router.push(`/chat/${chat_id}`);
        },
        onError: (error) => {
          console.error("error creating chat", error);
          toast.error("Error creating chat");
        },
      });
    } catch (error) {
      console.error("error uploading file", error);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: { "application/pdf": [".pdf"] },
  //   maxFiles: 1,
  //   onDrop: async (acceptedFiles) => {
  //     //   console.log(acceptedFiles);
  //     const file = acceptedFiles[0];
  //     if (file.size > 10 * 1024 * 1024) {
  //       toast.error("File too large");
  //       return;
  //     }

  //     try {
  //       setUploading(true);
  //       const data = await uploadToS3(file);
  //       if (!data?.file_key || !data.file_name) {
  //         toast.error("Something went wrong");
  //         return;
  //       }
  //       mutate(data, {
  //         onSuccess: ({ chat_id }) => {
  //           toast.success("Chat created!");
  //           router.push(`/chat/${chat_id}`);
  //         },
  //         onError: (err) => {
  //           toast.error("Error creating chat");
  //         },
  //       });

  //       console.log("data", data);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setUploading(false);
  //     }
  //   },
  // });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/">
            <h1 className="text-xl font-bold">notefuse</h1>
          </Link>
          {/* <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Plus className="h-5 w-5" />
              <span className="sr-only">New Chat</span>
            </Link>
          </Button> */}
        </div>
      </SidebarHeader>
      {/* <SidebarHeader>
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
      </SidebarHeader> */}
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      key={chat.id}
                      href={`/chat/${chat.id}`}
                      className="truncate"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{chat.pdfName}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Button
            className="w-full truncate"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading || status === "pending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </>
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
        </div>
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
