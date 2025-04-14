"use client"

import { useState } from "react"
import { MessageSquare, PlusCircle, Moon, Sun, Settings, LogOut, User, Bell, Languages } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar" // Using shadcn sidebar components [^4]

// Mock data for previous chats
const previousChats = [
  { id: "1", title: "Research on quantum computing", date: "2 hours ago", active: true },
  { id: "2", title: "AI ethics discussion", date: "Yesterday", active: false },
  { id: "3", title: "Neural networks overview", date: "3 days ago", active: false },
  { id: "4", title: "Machine learning algorithms", date: "Last week", active: false },
  { id: "5", title: "Data visualization techniques", date: "Last month", active: false },
]

export function ChatSidebar() {
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")
  const isCollapsed = state === "collapsed"

  const filteredChats = previousChats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2 py-2">
          {!isCollapsed && <h2 className="text-xl font-bold truncate">Deep Researcher</h2>}
        </div>
        <div className="px-2 pb-2">
          <Button
            variant="outline"
            className={`w-full ${isCollapsed ? "justify-center p-2 h-8 aspect-square" : "justify-start gap-2"}`}
            title="New Chat"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>New Chat</span>}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="px-2 pb-2">
            <SidebarInput
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton isActive={chat.active} tooltip={chat.title} className="justify-start gap-2">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    {!isCollapsed && (
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate w-full">{chat.title}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{chat.date}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              tooltip="Toggle theme"
              className="justify-start gap-2"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
              {!isCollapsed && <span>Toggle Theme</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="Settings" className="justify-start gap-2">
                  <Settings className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">Settings</span>}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right" className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Languages className="mr-2 h-4 w-4" />
                  <span>Language</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile" className="justify-start gap-2">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              {!isCollapsed && <span className="truncate">User Profile</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
      <SidebarTrigger className="absolute top-3 right-[-12px] z-50" />
    </Sidebar>
  )
}
