export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">About Us</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Welcome to Career-Based Physics Digital Learning System, where we bridge the gap between physics
                  education and real-world careers.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  Our platform is designed to provide students with an interactive and engaging approach to learning
                  physics by connecting concepts with practical applications in various industries, from engineering and
                  healthcare to technology and space exploration.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe that physics is more than just equations—it is the foundation of innovation and
                  problem-solving in today's fast-evolving job market. Through our digital learning system, students
                  gain access to interactive modules, career-focused lessons, and real-world problem-solving scenarios
                  that prepare them for future careers in STEM fields.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Approach</h2>
                <p className="text-lg text-muted-foreground">
                  Our mission is to empower learners with industry-relevant physics knowledge, making science education
                  more meaningful, accessible, and career-driven. Whether you are a high school student exploring career
                  paths or a professional seeking to enhance your physics skills, our platform offers a dynamic learning
                  experience tailored to your needs.
                </p>
                <p className="text-lg text-muted-foreground">
                  Join us as we revolutionize physics education and help shape the future of tomorrow's workforce!
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">STEMIFIED Instruction</h2>
                <p className="text-lg text-muted-foreground">
                  Our STEMIFIED instruction approach integrates Science, Technology, Engineering, and Mathematics into a
                  cohesive learning experience. This approach focuses on:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Connecting theoretical concepts with real-world applications</li>
                  <li>Developing critical thinking and problem-solving skills</li>
                  <li>Encouraging hands-on learning through interactive activities</li>
                  <li>Preparing students for careers in STEM fields</li>
                  <li>Fostering innovation and creativity in scientific thinking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
