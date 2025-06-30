"use client"

import { useState, useEffect } from "react"
import { Target, TrendingUp, CheckCircle, Zap } from "lucide-react"

export default function AnimatedTitle() {
  const [displayText, setDisplayText] = useState("")
  const [showIcon, setShowIcon] = useState(false)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

  const fullText = "DailyPulse"
  const icons = [Target, TrendingUp, CheckCircle, Zap]

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        // Show icon after text is complete
        setTimeout(() => {
          setShowIcon(true)
          // Cycle through icons
          const iconInterval = setInterval(() => {
            setCurrentIconIndex((prev) => (prev + 1) % icons.length)
          }, 800)

          // Stop cycling after showing all icons
          setTimeout(() => {
            clearInterval(iconInterval)
          }, 3200)
        }, 500)
      }
    }, 150) // Speed of typing

    return () => clearInterval(typingInterval)
  }, [])

  const CurrentIcon = icons[currentIconIndex]

  return (
    <span className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
      <span className="inline-block">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ${char === "P" ? "text-primary" : ""}`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {char}
          </span>
        ))}
        {displayText.length === fullText.length && (
          <span className="inline-block w-1 h-8 bg-primary ml-1 animate-pulse" />
        )}
      </span>
      {showIcon && (
        <span className="inline-block ml-4 animate-bounce">
          <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-primary transition-all duration-500" />
        </span>
      )}
    </span>
  )
}
