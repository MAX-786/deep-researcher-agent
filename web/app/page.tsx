"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "@ai-sdk/react" // Using AI SDK for chat functionality [^1]
import { ChatInterface } from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar" // Using shadcn sidebar [^4]
import { ChatSidebar } from "@/components/chat-sidebar"

export default function Home() {
  const [files, setFiles] = useState<File[]>([])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const handleRemoveFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file))
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <ChatSidebar />
          <SidebarInset className="flex-1">
            <ChatInterface
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSendMessage}
              isLoading={isLoading}
              files={files}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
