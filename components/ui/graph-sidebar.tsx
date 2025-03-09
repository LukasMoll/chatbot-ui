"use client"

import React, { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import graphData from "./blocks.json"
import { Button } from "@/components/ui/button"
import { IconChevronCompactRight } from "@tabler/icons-react"

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false
})

interface GraphSidebarProps {
  onClose: () => void
}

export const GraphSidebar: React.FC<GraphSidebarProps> = ({ onClose }) => {
  const fgRef = useRef<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current && graphData) {
        fgRef.current.zoomToFit(1000, 50)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative size-full">
      {/* Close Button: centered vertically on the left side of the graph panel */}
      <Button
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer"
        variant="ghost"
        size="icon"
        onClick={onClose}
      >
        <IconChevronCompactRight size={24} />
      </Button>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(node: any) => `${node.user}: ${node.description}`}
        nodeAutoColorBy="user"
        linkDirectionalParticles={1}
      />
    </div>
  )
}
