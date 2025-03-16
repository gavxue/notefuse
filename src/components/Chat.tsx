"use client";

import { Message, useChat } from "@ai-sdk/react";
import { Loader2, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  chatId: number;
};

export default function Chat({ chatId }: Props) {
  const [isInitialized, setIsInitialized] = useState(false);

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      try {
        const response = await axios.post<Message[]>("/api/get-messages", {
          chatId,
        });
        return response.data;
      } catch (error) {
        console.error("error getting messages", error);
        return [];
      }
    },
  });

  const chatOptions = {
    api: "/api/chat",
    body: { chatId },
    initialMessages: data || [],
  };

  const { messages, input, handleInputChange, handleSubmit, status } =
    useChat(chatOptions);

  useEffect(() => {
    if (isFetched && data && !isInitialized) {
      setIsInitialized(true);
    }
  }, [data, isFetched, isInitialized]);

  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
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
    <div className="h-screen w-full p-4">
      <Card className="flex flex-col h-full overflow-hidden">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        {/* Messages container - takes remaining height and scrolls */}
        <div className="flex-1 overflow-y-auto p-4" id="messages-container">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-center">
                <p className="text-muted-foreground">
                  Start a conversation by sending a message below.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
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
              ))
            )}
            {/* {(data || [])
                .concat(
                  messages.filter(
                    (msg) =>
                      !data?.some(
                        (dataMsg) =>
                          dataMsg.id === msg.id &&
                          dataMsg.content === msg.content
                      )
                  )
                )
                .map((message, index) => (
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
                ))} */}
          </div>
        </div>
        {/* Input form - fixed height */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={status !== "ready"}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
            >
              {status !== "ready" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
