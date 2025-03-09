"use client";

import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Message, useChat } from "@ai-sdk/react";
import MessageList from "./Messages";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = { chatId: number };

export default function Chat({ chatId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    // initialMessages: data,
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-sceren overflow-scroll"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <MessageList
        messages={[...(data || []), ...messages]}
        isLoading={isLoading}
      />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask any question..."
          className="w-full"
        />
        <Button className="bg-blue-600 ml-2">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
