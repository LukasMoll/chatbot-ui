"use client"
import React, { useRef, useEffect } from "react"
import ForceGraph3D from "react-force-graph-3d"

interface ForceGraph3DWrapperProps {
  onGraphReady?: (instance: any) => void
  [key: string]: any
}

export default function ForceGraph3DWrapper(props: ForceGraph3DWrapperProps) {
  const { onGraphReady, ...rest } = props
  const fgRef = useRef<any>(null)

  useEffect(() => {
    if (fgRef.current && onGraphReady) {
      onGraphReady(fgRef.current)
    }
    // We intentionally do not add onGraphReady as a dependency here
    // so that it's called only once when the instance is ready.
  }, [fgRef.current])

  return <ForceGraph3D ref={fgRef} {...rest} />
}
