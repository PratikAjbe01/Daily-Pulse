import { AlertCircle, Clock, Target, TrendingDown } from "lucide-react"

export default function WhySection() {
  const challenges = [
    {
      icon: Clock,
      title: "Lack of Consistency",
      description: "It's hard to remember to do something new every single day, especially when life gets busy.",
    },
    {
      icon: Target,
      title: "No Clear Progress",
      description:
        "Without tracking, it's impossible to see how far you've come or identify patterns in your behavior.",
    },
    {
      icon: TrendingDown,
      title: "Motivation Fades",
      description: "Initial enthusiasm wears off quickly without proper reinforcement and accountability systems.",
    },
    {
      icon: AlertCircle,
      title: "All or Nothing Mindset",
      description: "Missing one day often leads to giving up entirely, instead of getting back on track.",
    },
  ]

  return (
    <section id="why-section" className="py-20 bg-white max-w-7xl mx-auto px-4 ">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Why It's Hard to Build Habits
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building lasting habits is one of life's greatest challenges. Here's why most people struggle and give up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow duration-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-lg mb-4">
                <challenge.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
              <p className="text-muted-foreground text-sm">{challenge.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">92% of people fail to stick to their new habits</span>
          </div>
        </div>
      </div>
    </section>
  )
}
