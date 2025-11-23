import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAction } from "convex/react";
import type { FunctionReference } from "convex/server";

import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;

import { toast } from "sonner";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

interface AIMentorChatProps {
  analysisId?: string;
}

export function AIMentorChat({ analysisId }: AIMentorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWithMentor = useAction(api.aiMentor.chatWithMentor as FunctionReference<"action">);

  const starterQuestions = [
    "How can I improve my CV?",
    "What job fits my skills?",
    "How do I negotiate salary?",
    "Tips for career transitions?",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await chatWithMentor({ message });
      
      const aiMessage: Message = {
        role: "ai",
        content: result.response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      
      const errorMessage: Message = {
        role: "ai",
        content: "I'm sorry, I encountered an error. Please try asking your question again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  const renderMessage = (content: string) => {
    return content.split(/\*\*(.*?)\*\*/g).map((part, index) => {
      return index % 2 === 1 ? (
        <strong key={index} className="font-bold">
          {part}
        </strong>
      ) : (
        part
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Button
            size="lg"
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary via-accent to-secondary hover:shadow-primary/50"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Chat Window */}
            <motion.div
              className="relative w-full max-w-md h-[600px] md:h-[700px]"
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <Card className="h-full flex flex-col shadow-2xl border-2 border-primary/20 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Career Mentor</h3>
                      <p className="text-xs text-muted-foreground">Ask me anything about your career</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearChat}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <Sparkles className="h-12 w-12 text-primary mb-4" />
                      <h4 className="font-semibold text-lg mb-2">Welcome! 👋</h4>
                      <p className="text-sm text-muted-foreground mb-6">
                        I'm your AI career mentor. Ask me anything about your career journey!
                      </p>
                      <div className="space-y-2 w-full">
                        <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                        {starterQuestions.map((question, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(question)}
                            className="w-full text-left justify-start"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                              {renderMessage(message.content)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-muted rounded-2xl rounded-bl-none p-4 shadow-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-background shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your question..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}