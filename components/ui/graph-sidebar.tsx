"use client"

import React, { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import graphData from "./blocks.json"

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false
})

export const GraphSidebar: React.FC = () => {
  const fgRef = useRef<any>(null)

  useEffect(() => {
    // Wait a short time so the container can measure itself
    const timer = setTimeout(() => {
      if (fgRef.current && graphData) {
        // Zoom the camera so all nodes are in view
        fgRef.current.zoomToFit(1000, 50)
        // ^ 1000ms animation, 50px padding
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="size-full">
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
