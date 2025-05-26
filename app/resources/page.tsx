import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">🧪 Physics Learning Resources</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  A curated collection of free and accessible physics tools for students, teachers, and science
                  enthusiasts.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search resources..." className="w-full bg-background pl-8" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="general">General Learning</TabsTrigger>
                <TabsTrigger value="simulations">Interactive Simulations</TabsTrigger>
                <TabsTrigger value="textbooks">Open Textbooks</TabsTrigger>
                <TabsTrigger value="problem-solving">Problem Solving</TabsTrigger>
                <TabsTrigger value="videos">Video Learning</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Khan Academy</CardTitle>
                      <CardDescription>
                        Free lessons, videos, and exercises from basic to advanced physics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive coverage of physics topics with interactive exercises and video explanations.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.khanacademy.org/science/physics" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>HyperPhysics</CardTitle>
                      <CardDescription>
                        Concept maps and concise explanations for all major physics topics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        An exploration environment for concepts in physics employing concept maps and other linking
                        strategies.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="http://hyperphysics.phy-astr.gsu.edu/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>The Physics Classroom</CardTitle>
                      <CardDescription>High school-friendly tutorials, simulations, and quizzes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Physics education for high school students, featuring tutorials, interactive simulations, and
                        concept builders.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.physicsclassroom.com/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>MIT OpenCourseWare</CardTitle>
                      <CardDescription>Free university-level physics lectures, notes, and assignments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Access to MIT's undergraduate and graduate courses in physics, including lecture notes,
                        assignments, and exams.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://ocw.mit.edu/index.htm" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Coursera</CardTitle>
                      <CardDescription>College-level physics courses by top universities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Online courses from universities worldwide covering various physics topics from introductory to
                        advanced levels.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="simulations" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>PhET Interactive Simulations</CardTitle>
                      <CardDescription>Fun and interactive physics and science simulations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Free interactive math and science simulations based on research from the University of Colorado
                        Boulder.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://phet.colorado.edu/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>My Physics Lab</CardTitle>
                      <CardDescription>Simulations in mechanics and systems of motion.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Interactive physics simulations with detailed explanations of the mathematics behind them.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.myphysicslab.com/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Falstad Physics Applets</CardTitle>
                      <CardDescription>Simulations in waves, electricity, optics, and more.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Collection of interactive Java applets covering various physics topics.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.falstad.com/mathphysics.html" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="textbooks" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>OpenStax Physics</CardTitle>
                      <CardDescription>Free downloadable textbooks for high school and college.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Peer-reviewed, openly licensed textbooks available for free online and in low-cost print
                        editions.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://openstax.org/subjects/science" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>LibreTexts Physics</CardTitle>
                      <CardDescription>A dynamic, open-source platform for physics content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Collaborative platform for developing open educational resources.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://phys.libretexts.org/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>CK-12 Foundation</CardTitle>
                      <CardDescription>FlexBooks and interactive content across all physics topics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Free online textbooks, videos, exercises, flashcards, and real-world applications for physics.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.ck12.org/student/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="problem-solving" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Brilliant.org</CardTitle>
                      <CardDescription>Problem-solving-based physics learning (free & paid).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Interactive courses that teach physics through problem-solving and interactive challenges.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://brilliant.org/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Isaac Physics</CardTitle>
                      <CardDescription>
                        Free problems for students moving from high school to university physics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Platform offering physics problems with varying levels of difficulty to bridge the gap between
                        high school and university.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://isaacphysics.org/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Physics Stack Exchange</CardTitle>
                      <CardDescription>Ask or browse complex physics questions and expert answers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Q&A site for active researchers, academics, and students of physics.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://physics.stackexchange.com/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="videos" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>MinutePhysics</CardTitle>
                      <CardDescription>Short, engaging physics videos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Simply put: cool physics and other sweet science videos, explaining physics concepts in short,
                        animated videos.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.youtube.com/user/minutephysics" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Veritasium</CardTitle>
                      <CardDescription>Explores deep science concepts and experiments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Videos about science, education, and anything else that's interesting, with a focus on physics
                        and engineering.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.youtube.com/user/1veritasium" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>PBS SpaceTime</CardTitle>
                      <CardDescription>Physics and cosmology topics in detail.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Explores the outer reaches of space, the craziness of astrophysics, and the mysteries of time
                        and relativity.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="https://www.youtube.com/pbsspacetime" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Physics Digital Learning System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
