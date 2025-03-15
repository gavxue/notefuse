"use client";

import { Message, useChat } from "@ai-sdk/react";
import { Loader2, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "@/components/ui/card";

type Props = {
  chatId: number;
};

export default function Chat({ chatId }: Props) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const chatOptions = {
    api: "/api/chat",
    body: { chatId },
    initialMessages: data || []
  };

  const { messages, input, handleInputChange, handleSubmit, status } = useChat(chatOptions);

  useEffect(() => {
    if (isFetched && data && !isInitialized) {
      setIsInitialized(true);
    }
  }, [data, isFetched, isInitialized]);

  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4" id="messages-container">
        <div className="space-y-4 pb-4">
          {(data || []).concat(messages.filter(msg => 
            !data?.some(dataMsg => 
              dataMsg.id === msg.id && dataMsg.content === msg.content
            )
          )).map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={status !== "ready"}
            className="flex-1"
          />
          <Button type="submit" disabled={status !== "ready" || !input.trim()}>
            {status !== "ready" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
