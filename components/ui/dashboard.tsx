"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState, useEffect } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"
import dynamic from "next/dynamic"
import { GraphSidebar } from "@/components/ui/graph-sidebar"

export const SIDEBAR_WIDTH = 350
export const RIGHT_SIDEBAR_WIDTH = 800

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  // Hotkey to toggle left sidebar.
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const { handleSelectDeviceFile } = useSelectFileHandler()

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    const file = files[0]
    handleSelectDeviceFile(file)
    setIsDragging(false)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  const handleToggleRightSidebar = () => {
    setShowRightSidebar(prevState => !prevState)
    localStorage.setItem("showRightSidebar", String(!showRightSidebar))
  }

  return (
    <div className="flex size-full">
      <CommandK />

      {/* Left Sidebar */}
      {showSidebar && (
        <div
          className="border-r-2 duration-200 dark:border-none"
          style={{
            minWidth: `${SIDEBAR_WIDTH}px`,
            maxWidth: `${SIDEBAR_WIDTH}px`,
            width: `${SIDEBAR_WIDTH}px`
          }}
        >
          <Tabs
            className="flex h-full"
            value={contentType}
            onValueChange={tabValue => {
              setContentType(tabValue as ContentType)
              router.replace(`${pathname}?tab=${tabValue}`)
            }}
          >
            <SidebarSwitcher onContentTypeChange={setContentType} />
            <Sidebar contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        </div>
      )}

      {/* Main Content */}
      <div
        className="bg-muted/50 relative flex flex-1 flex-col"
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {isDragging ? (
          <div className="flex h-full items-center justify-center bg-black/50 text-2xl text-white">
            drop file here
          </div>
        ) : (
          children
        )}

        {/* Left Toggle Button */}
        <Button
          className={cn("absolute left-[4px] top-[50%] z-10 cursor-pointer")}
          style={{
            transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)"
          }}
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
        >
          <IconChevronCompactRight size={24} />
        </Button>

        {/* Right Toggle Button */}
        <Button
          className={cn("absolute right-[4px] top-[50%] z-10 cursor-pointer")}
          variant="ghost"
          size="icon"
          onClick={handleToggleRightSidebar}
        >
          <IconChevronCompactRight size={24} className="rotate-180" />
        </Button>
      </div>

      {/* Right Sidebar with ForceGraph3D */}
      {showRightSidebar && (
        <div className="bg-muted/50 relative h-full w-1/2">
          <GraphSidebar />
        </div>
      )}
    </div>
  )
}
