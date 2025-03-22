"use client";

import { Message, useChat } from "@ai-sdk/react";
import { Loader2, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  chatId: number;
};

export default function Chat({ chatId }: Props) {
  // Query to fetch messages
  const {
    status: dataStatus,
    data,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      try {
        const response = await axios.post<Message[]>("/api/get-messages", {
          chatId,
        });
        return response.data;
      } catch (error) {
        console.error("Error getting messages:", error);
        return [];
      }
    },
  });

  // Initialize chat after messages are loaded
  const chatOptions = {
    api: "/api/chat",
    body: { chatId },
    initialMessages: data || [],
  };

  const {
    status,
    messages,
    input,
    setMessages,
    handleInputChange,
    handleSubmit,
  } = useChat(chatOptions);

  useEffect(() => {
    setMessages(data || []);
  }, [data]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
    }
  }, [messages]);

  return (
    <div className="h-screen w-full p-4">
      <Card className="flex flex-col h-full overflow-hidden">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4" id="messages-container">
          {dataStatus === "pending" ? (
            // Loading skeleton for messages
            <div className="space-y-4">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-12 w-3/4 ml-auto" />
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-12 w-1/2 ml-auto" />
            </div>
          ) : dataStatus === "error" ? (
            <div>Error loading messages: {error.message}</div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages && messages.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-center">
                  <p className="text-muted-foreground">
                    Start a conversation by sending a message below.
                  </p>
                </div>
              ) : (
                <>
                  {messages &&
                    messages.map((message) => (
                      <div
                        key={message.id || `msg-${Date.now()}-${Math.random()}`}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
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

                  {/* thinking indicator when AI is responding */}
                  {status === "submitted" && (
                    <div className="flex justify-start">
                      <div className="bg-muted max-w-[80%] rounded-lg px-4 py-4 h-10">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
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
              {status === "submitted" ? (
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
