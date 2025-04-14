"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import type { Message } from "ai"
import { Send, Paperclip, Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  files: File[]
  onFileUpload: (files: File[]) => void
  onRemoveFile: (file: File) => void
}

export function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  files,
  onFileUpload,
  onRemoveFile
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(Array.from(e.target.files))
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">Deep Researcher Assistant</h2>
        <p className="text-sm text-muted-foreground">Ask complex research questions and upload files for analysis</p>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <Bot className="h-16 w-16 mb-4 text-primary" />
              <h3 className="text-xl font-medium">Welcome to Deep Researcher</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Upload research papers or ask complex questions to get started.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-3 max-w-[80%]">
                  {message.role !== "user" && (
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    </Avatar>
                  )}

                  <Card className={`${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <CardContent className="p-2">
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </CardContent>
                  </Card>

                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback>US</AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Files display */}
      {files.length > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="bg-muted rounded-md px-3 py-1 text-sm flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveFile(file)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Button type="button" size="icon" variant="outline" onClick={handleFileButtonClick}>
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach files</span>
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a research question..."
            className="flex-1"
          />

          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
        </form>
      </div>
    </div>
  )
}
