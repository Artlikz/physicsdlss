import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MotionDiv, fadeIn } from "@/components/motion"
import { getCurrentUser } from "@/lib/db-service"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 flex flex-col items-center justify-center gap-8 p-6 md:p-12">
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="max-w-2xl text-center">
          <div className="flex justify-center mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/482469750_2752253804978432_3177860335641338493_n-hlhVAhWIU4HfV8fOEqCBMGQi4ZVLmN.png"
              alt="STEM School Logo"
              className="h-32"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-heading mb-6">
            Physics Digital Learning Support System
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover the world of physics through STEMIFIED instruction. Learn with interactive modules, career-focused
            content, and engaging activities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link href="/career-paths">
                <Button size="lg" className="text-lg px-8">
                  Continue Learning
                </Button>
              </Link>
            ) : (
              <Link href="/login-page">
                <Button size="lg" className="text-lg px-8">
                  Log In
                </Button>
              </Link>
            )}
            <Link href="/resources">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Explore Resources
              </Button>
            </Link>
          </div>
        </MotionDiv>
      </section>

      <section className="bg-secondary/50 py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-heading">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <MotionDiv
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
              className="bg-background rounded-lg p-6 shadow-md"
            >
              <h3 className="text-xl font-bold mb-3">Career-Focused Learning</h3>
              <p className="text-muted-foreground">
                Specialized physics modules tailored for engineers, doctors, and pilots.
              </p>
            </MotionDiv>
            <MotionDiv
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="bg-background rounded-lg p-6 shadow-md"
            >
              <h3 className="text-xl font-bold mb-3">Interactive Quizzes</h3>
              <p className="text-muted-foreground">
                Test your knowledge with engaging quizzes and track your progress.
              </p>
            </MotionDiv>
            <MotionDiv
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-lg p-6 shadow-md"
            >
              <h3 className="text-xl font-bold mb-3">STEMIFIED Approach</h3>
              <p className="text-muted-foreground">
                Learn physics through our unique STEMIFIED instructional methodology.
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>
    </div>
  )
}
