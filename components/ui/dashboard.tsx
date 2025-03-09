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
import { FC, useState } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"
import { GraphSidebar } from "@/components/ui/graph-sidebar"

export const SIDEBAR_WIDTH = 350

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  // Hotkey to toggle left sidebar.
  useHotkey("s", () => setShowSidebar(prev => !prev))

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
  // Use a single state to control graph panel width in percent: 0 (closed), 50, or 100.
  const [graphPanelWidth, setGraphPanelWidth] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleSelectDeviceFile(file)
    setIsDragging(false)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleToggleSidebar = () => {
    setShowSidebar(prev => !prev)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  // External right toggle button:
  // Closed (0)  -> Open at 50%
  // 50%         -> Expand to 100%
  // 100%        -> Shrink to 50%
  const handleToggleRightSidebar = () => {
    if (graphPanelWidth === 0) {
      setGraphPanelWidth(50)
      localStorage.setItem("graphPanelWidth", "50")
    } else if (graphPanelWidth === 50) {
      setGraphPanelWidth(100)
      localStorage.setItem("graphPanelWidth", "100")
    } else if (graphPanelWidth === 100) {
      setGraphPanelWidth(50)
      localStorage.setItem("graphPanelWidth", "50")
    }
  }

  return (
    <div className="flex size-full overflow-hidden">
      <CommandK />

      {/* Left Sidebar */}
      {showSidebar && (
        <div className="flex-none" style={{ width: SIDEBAR_WIDTH }}>
          <Tabs
            className="flex h-full"
            value={contentType}
            onValueChange={val => {
              setContentType(val as ContentType)
              router.replace(`${pathname}?tab=${val}`)
            }}
          >
            <SidebarSwitcher onContentTypeChange={setContentType} />
            <Sidebar contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        </div>
      )}

      {/* Main Content */}
      <div
        className="bg-muted/50 relative flex flex-1 flex-col overflow-auto"
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
          className={cn(
            "absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
          )}
          style={{ transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)" }}
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
        >
          <IconChevronCompactRight size={24} />
        </Button>

        {/* Right Toggle Button */}
        <Button
          className={cn(
            "absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
          )}
          variant="ghost"
          size="icon"
          onClick={handleToggleRightSidebar}
        >
          <IconChevronCompactRight size={24} className="rotate-180" />
        </Button>
      </div>

      {/* Right Sidebar */}
      {graphPanelWidth > 0 && (
        <div
          className="bg-muted/50 h-full flex-none"
          style={{ width: `${graphPanelWidth}vw` }}
        >
          <GraphSidebar
            onClose={() => {
              // Internal close button:
              // If currently 100%, shrink to 50%
              // If currently 50%, close it (set width to 0)
              if (graphPanelWidth === 100) {
                setGraphPanelWidth(50)
                localStorage.setItem("graphPanelWidth", "50")
              } else if (graphPanelWidth === 50) {
                setGraphPanelWidth(0)
                localStorage.setItem("graphPanelWidth", "0")
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
