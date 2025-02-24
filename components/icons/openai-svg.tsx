import { FC } from "react"

interface OpenAIImageProps {
  height?: number
  width?: number
  className?: string
}

export const OpenAISVG: FC<OpenAIImageProps> = ({
  height = 40,
  width = 40,
  className
}) => {
  return (
    <img
      src="https://www.osgg.be/wp-content/uploads/2021/01/UGent_logo-945x795.jpg"
      alt="OpenAI Logo"
      height={height}
      width={width}
      className={className}
    />
  )
}
