"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import graphData from "./blocks.json"
import { Button } from "@/components/ui/button"
import { IconChevronCompactRight } from "@tabler/icons-react"

// Dynamically import the wrapper component
const ForceGraph3DWrapper = dynamic(() => import("./ForceGraph3DWrapper"), {
  ssr: false
})

interface GraphSidebarProps {
  onClose: () => void
  graphPanelWidth: number
}

export const GraphSidebar: React.FC<GraphSidebarProps> = ({
  onClose,
  graphPanelWidth
}) => {
  const [graphInstance, setGraphInstance] = useState<any>(null)

  useEffect(() => {
    // Call zoomToFit after a delay once the graph instance is ready.
    const timer = setTimeout(() => {
      if (graphInstance && graphData) {
        graphInstance.zoomToFit(1000, 50)
      }
    }, 500)

    // Set up a live logging loop for the camera position.
    let frameId: number
    const logCameraPosition = () => {
      frameId = requestAnimationFrame(logCameraPosition)
    }
    logCameraPosition()

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frameId)
    }
  }, [graphInstance])

  // Determine the transform style based on the panel width.
  const transformValue =
    graphPanelWidth === 50 ? "translateX(-50%)" : "translateX(0%)"

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
      {/*
          The outer div here can use clipPath if you need to hide part of the graph.
          For now, it’s not clipping anything since inset is all zeros.
      */}
      <div style={{ clipPath: "inset(0 0 0 0%)" }}>
        <div style={{ transform: transformValue }}>
          <ForceGraph3DWrapper
            onGraphReady={setGraphInstance}
            graphData={graphData}
            nodeLabel={(node: any) => `${node.user}: ${node.description}`}
            nodeAutoColorBy="user"
            linkDirectionalParticles={1}
          />
        </div>
      </div>
    </div>
  )
}
