"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, useUser } from "@clerk/nextjs"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import AnimatedTitle from "./animate-title"

export default function HeroSection() {
  const { isSignedIn } = useUser()

  const scrollToWhy = () => {
    document.getElementById("why-section").scrollIntoView({
      behavior: "smooth",
    })
  }

  // Generate heatmap data for background
  const generateHeatmapData = () => {
    const data = []
    for (let i = 0; i < 365; i++) {
      data.push(Math.floor(Math.random() * 5))
    }
    return data
  }

  const heatmapData = generateHeatmapData()

  return (
    <section className="relative min-h-screen max-w-7xl mx-auto px-4 py-3 flex items-center justify-center overflow-hidden bg-background">
      {/* Heatmap Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-52 gap-1 p-8 transform rotate-12 scale-150">
          {heatmapData.map((intensity, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${
                intensity === 0
                  ? "bg-gray-100 dark:bg-gray-800"
                  : intensity === 1
                    ? "bg-green-100 dark:bg-green-950"
                    : intensity === 2
                      ? "bg-green-300 dark:bg-green-800"
                      : intensity === 3
                        ? "bg-green-400 dark:bg-green-600"
                        : "bg-green-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col items-start space-y-8 text-left max-w-3xl">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
             <AnimatedTitle/>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl">
              Transform your life one habit at a time. Track, build, and maintain habits that stick with our powerful
              habit tracking platform.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </>
            ) : (
              <SignInButton path="/sign-up">
                <Button
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started Free
                </Button>
              </SignInButton>
            )}

            <button
              onClick={scrollToWhy}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
            >
              <span className="text-sm font-medium  ">Learn More</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating habit cards for visual interest */}
      <div className="absolute top-20 right-10 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-lg hidden lg:block">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-card-foreground">7 day streak!</span>
        </div>
      </div>

      <div className="absolute bottom-32 right-20 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-lg hidden lg:block">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-card-foreground">Morning run ✓</span>
        </div>
      </div>
    </section>
  )
}
