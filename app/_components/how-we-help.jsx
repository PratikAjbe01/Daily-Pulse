'use client'
import { Calendar, Mail, BarChart3, Zap, CheckCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton ,useUser} from "@clerk/nextjs"
import Link from "next/link";

export default function HowWeHelpSection() {
    const {isSignedIn}=useUser();
  const features = [
    {
      icon: Calendar,
      title: "Daily Streak Tracking",
      description: "Visualize your progress with beautiful streak counters and never lose sight of your momentum.",
    },
    {
      icon: Mail,
      title: "Smart Reminder Emails",
      description: "Get personalized reminders at the perfect time to keep you on track with your habits.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Understand your patterns with detailed analytics and insights about your habit performance.",
    },
    {
      icon: Zap,
      title: "Habit Stacking",
      description: "Build new habits by connecting them to existing ones for maximum success rate.",
    },
    {
      icon: CheckCircle,
      title: "Simple Check-ins",
      description: "Mark habits complete with a single tap. No complicated logging or time-consuming processes.",
    },
    {
      icon: Bell,
      title: "Flexible Scheduling",
      description: "Set custom schedules that work with your lifestyle, not against it.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30 max-w-7xl mx-auto px-4  ">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            How We Help You Create Lasting Habits
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DailyPulse provides the tools, motivation, and accountability you need to turn intentions into lasting
            habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Success Stats */}
        <div className="bg-card rounded-2xl p-8 border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-muted-foreground">Success Rate</div>
              <div className="text-sm text-muted-foreground/70">Users who stick to habits for 30+ days</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">21</div>
              <div className="text-muted-foreground">Average Days</div>
              <div className="text-sm text-muted-foreground/70">To form a new habit with DailyPulse</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Happy Users</div>
              <div className="text-sm text-muted-foreground/70">Building better habits every day</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
    {
        isSignedIn?<>
        <Link href='/dashboard'>
         <Button
            size="lg"
            className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Building Habits Today
          </Button>
          </Link>
        </>:<>        <SignInButton path='/sign-up'>
          <Button
            size="lg"
            className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Building Habits Today
          </Button>
          </SignInButton></>
    }
          <p className="text-sm text-muted-foreground/70 mt-2">Free forever. No credit card required.</p>
        </div>
      </div>
    </section>
  )
}
