"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ChatInterface } from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar" // Using shadcn sidebar [^4]
import { ChatSidebar } from "@/components/chat-sidebar"
import { Message } from "ai"

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to the chat
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    // Clear input and set loading state
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.choices[0].message.content
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again."
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setIsLoading(true)
    try {
      // Create form data
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append("file", file)
      })

      // Upload files
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload files")
      }

      const data = await response.json()

      // Add files to state
      setFiles((prev) => [...prev, ...uploadedFiles])

      // Add system message about successful upload
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "system",
          content: `File${uploadedFiles.length > 1 ? 's' : ''} uploaded successfully. You can now ask questions about the content.`
        },
      ])
    } catch (error) {
      console.error("Error uploading files:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "system",
          content: "Sorry, I encountered an error uploading your files. Please try again."
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
  }

  const handleRemoveFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file))
  }

  // If not authenticated, don't render the main content
  if (!isAuthenticated) {
    return null
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
