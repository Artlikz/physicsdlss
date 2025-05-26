"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, isModuleUnlocked } from "@/lib/db-service"
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, FileText } from "lucide-react"

// Define the modules for the engineer path with detailed reviewer content
const engineerModules = [
  {
    id: 1,
    title: "Introduction to Physics for Engineers",
    description: "Fundamental concepts, measurements, and the scientific method",
    reviewer: {
      introduction: `
        <h2>Introduction to Physics for Engineers</h2>
        <p>Physics is the foundation of engineering. This module introduces the fundamental concepts, units of measurement, and the scientific method that engineers use to understand and manipulate the physical world.</p>
        
        <h3>Learning Objectives</h3>
        <ul>
          <li>Understand the International System of Units (SI) and their importance in engineering</li>
          <li>Master vector analysis and its applications in engineering problems</li>
          <li>Apply the scientific method to engineering challenges</li>
          <li>Develop systematic problem-solving approaches for physics problems</li>
        </ul>
      `,
      sections: [
        {
          title: "SI Units and Measurement Standards",
          content: `
            <h3>SI Units and Measurement Standards</h3>
            <p>The International System of Units (SI) provides a consistent framework for measurements in science and engineering. Understanding these units is crucial for accurate calculations and communication in engineering.</p>
            
            <h4>Base SI Units</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <ul>
                <li><strong>Meter (m)</strong>: The base unit of length</li>
                <li><strong>Kilogram (kg)</strong>: The base unit of mass</li>
                <li><strong>Second (s)</strong>: The base unit of time</li>
                <li><strong>Ampere (A)</strong>: The base unit of electric current</li>
                <li><strong>Kelvin (K)</strong>: The base unit of temperature</li>
                <li><strong>Mole (mol)</strong>: The base unit of amount of substance</li>
                <li><strong>Candela (cd)</strong>: The base unit of luminous intensity</li>
              </ul>
            </div>
            
            <h4>Derived Units</h4>
            <p>Derived units are formed by combining base units. Some important derived units in engineering include:</p>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <ul>
                <li><strong>Newton (N)</strong>: The unit of force (kg·m/s²)</li>
                <li><strong>Joule (J)</strong>: The unit of energy (N·m)</li>
                <li><strong>Watt (W)</strong>: The unit of power (J/s)</li>
                <li><strong>Pascal (Pa)</strong>: The unit of pressure (N/m²)</li>
                <li><strong>Volt (V)</strong>: The unit of electrical potential (W/A)</li>
              </ul>
            </div>
            
            <h4>Measurement Precision and Accuracy</h4>
            <p>In engineering, understanding the difference between precision and accuracy is crucial:</p>
            <ul>
              <li><strong>Accuracy</strong>: How close a measurement is to the true value</li>
              <li><strong>Precision</strong>: How reproducible measurements are (consistency)</li>
            </ul>
            <p>Engineers must consider both when designing systems and analyzing data.</p>
          `,
        },
        {
          title: "Vector Analysis and Applications",
          content: `
            <h3>Vector Analysis and Applications</h3>
            <p>Vectors are quantities that have both magnitude and direction. They are essential tools in engineering for representing forces, velocities, accelerations, and many other physical quantities.</p>
            
            <h4>Vector Properties</h4>
            <ul>
              <li>A vector has both magnitude (size) and direction</li>
              <li>Vectors can be represented graphically as arrows</li>
              <li>The length of the arrow represents the magnitude</li>
              <li>The direction of the arrow represents the direction</li>
            </ul>
            
            <h4>Vector Operations</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p><strong>Vector Addition</strong>: C = A + B</p>
              <p>To add vectors, add their components in each direction:</p>
              <ul>
                <li>Cx = Ax + Bx</li>
                <li>Cy = Ay + By</li>
                <li>Cz = Az + Bz</li>
              </ul>
              
              <p><strong>Vector Magnitude</strong>: |A| = √(Ax² + Ay² + Az²)</p>
              <p>The magnitude of a vector is calculated using the Pythagorean theorem in three dimensions.</p>
              
              <p><strong>Dot Product</strong>: A·B = |A||B|cos(θ)</p>
              <p>The dot product gives a scalar value and is useful for finding the angle between vectors and calculating work.</p>
              
              <p><strong>Cross Product</strong>: A×B = |A||B|sin(θ)n</p>
              <p>The cross product gives a vector perpendicular to both A and B, useful for finding torque and angular momentum.</p>
            </div>
            
            <h4>Engineering Applications</h4>
            <p>Vector analysis is used in numerous engineering applications:</p>
            <ul>
              <li>Force analysis in structures</li>
              <li>Velocity and acceleration in dynamics</li>
              <li>Electric and magnetic fields</li>
              <li>Fluid flow and heat transfer</li>
            </ul>
          `,
        },
        {
          title: "Scientific Method in Engineering",
          content: `
            <h3>Scientific Method in Engineering</h3>
            <p>The scientific method is a systematic approach to investigating phenomena and acquiring new knowledge. Engineers apply this method to solve problems and develop new technologies.</p>
            
            <h4>Steps of the Scientific Method</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <ol>
                <li><strong>Observation</strong>: Identify a problem or phenomenon</li>
                <li><strong>Question</strong>: Formulate questions about the observation</li>
                <li><strong>Hypothesis</strong>: Propose an explanation or solution</li>
                <li><strong>Prediction</strong>: Make predictions based on the hypothesis</li>
                <li><strong>Testing</strong>: Design and conduct experiments to test predictions</li>
                <li><strong>Analysis</strong>: Analyze data and draw conclusions</li>
                <li><strong>Communication</strong>: Share results and receive feedback</li>
                <li><strong>Refinement</strong>: Refine the hypothesis based on results</li>
              </ol>
            </div>
            
            <h4>Engineering Application</h4>
            <p>Engineers apply the scientific method in a practical context:</p>
            <ul>
              <li>Identifying engineering problems that need solutions</li>
              <li>Researching existing solutions and approaches</li>
              <li>Developing prototypes and models</li>
              <li>Testing designs under various conditions</li>
              <li>Analyzing performance data</li>
              <li>Iterating and improving designs</li>
            </ul>
            
            <p>This methodical approach ensures that engineering solutions are based on sound scientific principles and rigorous testing.</p>
          `,
        },
        {
          title: "Problem-Solving Approaches",
          content: `
            <h3>Problem-Solving Approaches in Physics</h3>
            <p>Effective problem-solving is at the heart of engineering. A systematic approach helps engineers tackle complex problems efficiently.</p>
            
            <h4>General Problem-Solving Framework</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <ol>
                <li><strong>Understand the Problem</strong>
                  <ul>
                    <li>Identify what is being asked</li>
                    <li>List known and unknown quantities</li>
                    <li>Determine relevant principles and concepts</li>
                  </ul>
                </li>
                <li><strong>Devise a Plan</strong>
                  <ul>
                    <li>Select appropriate equations and methods</li>
                    <li>Break complex problems into simpler parts</li>
                    <li>Consider alternative approaches</li>
                  </ul>
                </li>
                <li><strong>Execute the Plan</strong>
                  <ul>
                    <li>Apply selected methods and equations</li>
                    <li>Perform calculations carefully</li>
                    <li>Track units throughout calculations</li>
                  </ul>
                </li>
                <li><strong>Verify the Solution</strong>
                  <ul>
                    <li>Check if the answer makes physical sense</li>
                    <li>Verify units are correct</li>
                    <li>Consider limiting cases</li>
                    <li>Estimate expected magnitude of answer</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <h4>Common Physics Problem-Solving Techniques</h4>
            <ul>
              <li><strong>Free Body Diagrams</strong>: Visual representations of all forces acting on an object</li>
              <li><strong>Conservation Laws</strong>: Applying conservation of energy, momentum, or charge</li>
              <li><strong>Dimensional Analysis</strong>: Checking equation consistency using dimensions</li>
              <li><strong>Approximation</strong>: Simplifying complex problems by making reasonable assumptions</li>
              <li><strong>Symmetry</strong>: Using symmetry to simplify problems</li>
            </ul>
            
            <h4>Example: Solving a Projectile Motion Problem</h4>
            <p>Consider a ball thrown with initial velocity v at angle θ:</p>
            <ol>
              <li><strong>Understand</strong>: We need to find the range (horizontal distance).</li>
              <li><strong>Plan</strong>: Break into horizontal and vertical components, use kinematic equations.</li>
              <li><strong>Execute</strong>: 
                <ul>
                  <li>Horizontal component: vx = v·cos(θ)</li>
                  <li>Vertical component: vy = v·sin(θ)</li>
                  <li>Time of flight: t = 2vy/g</li>
                  <li>Range: R = vx·t = v²·sin(2θ)/g</li>
                </ul>
              </li>
              <li><strong>Verify</strong>: Check units (meters), consider special cases (θ = 45° gives maximum range).</li>
            </ol>
          `,
        },
      ],
      summary: `
        <h3>Module Summary</h3>
        <p>In this module, we've covered the fundamental concepts that form the foundation of physics for engineers:</p>
        
        <ul>
          <li>The International System of Units (SI) provides a standardized framework for measurements in engineering.</li>
          <li>Vector analysis allows engineers to work with quantities that have both magnitude and direction, essential for analyzing forces, motion, and fields.</li>
          <li>The scientific method offers a systematic approach to investigating phenomena and solving engineering problems.</li>
          <li>Effective problem-solving techniques help engineers tackle complex physics problems in a structured way.</li>
        </ul>
        
        <p>These concepts are fundamental to all areas of engineering and will be built upon in subsequent modules. Understanding these basics is crucial for success in more advanced topics.</p>
        
        <div class="bg-primary/10 p-4 rounded-md my-4">
          <h4>Key Takeaways</h4>
          <ul>
            <li>Always pay attention to units and dimensions in calculations</li>
            <li>Break vector problems into components to simplify analysis</li>
            <li>Apply the scientific method to engineering challenges</li>
            <li>Use a systematic approach to problem-solving</li>
          </ul>
        </div>
        
        <p>You're now ready to test your understanding with the module quiz. Good luck!</p>
      `,
    },
  },
  {
    id: 2,
    title: "Mechanics: Forces and Motion",
    description: "Newton's laws, forces, and their applications in engineering",
    reviewer: {
      introduction: `
        <h2>Mechanics: Forces and Motion</h2>
        <p>Mechanics is the branch of physics that deals with the motion of objects and the forces that cause this motion. This module covers the fundamental principles of mechanics, focusing on Newton's laws of motion and their applications in engineering contexts.</p>
        
        <h3>Learning Objectives</h3>
        <ul>
          <li>Understand and apply Newton's three laws of motion</li>
          <li>Analyze forces using free body diagrams</li>
          <li>Calculate friction forces and understand their engineering applications</li>
          <li>Apply equilibrium conditions to engineering problems</li>
          <li>Understand work, energy, and power in mechanical systems</li>
        </ul>
      `,
      sections: [
        {
          title: "Newton's Three Laws of Motion",
          content: `
            <h3>Newton's Three Laws of Motion</h3>
            <p>Sir Isaac Newton's three laws of motion form the foundation of classical mechanics and are fundamental to understanding how objects move under the influence of forces.</p>
            
            <h4>First Law: Law of Inertia</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p><strong>An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an external force.</strong></p>
            </div>
            
            <p>This law introduces the concept of inertia - the resistance of an object to changes in its state of motion. The more mass an object has, the greater its inertia.</p>
            
            <p><strong>Engineering Applications:</strong></p>
            <ul>
              <li>Vehicle safety features (seat belts, airbags) account for inertia during sudden stops</li>
              <li>Flywheels use inertia to store rotational energy</li>
              <li>Balancing rotating machinery to prevent vibration</li>
            </ul>
            
            <h4>Second Law: Force and Acceleration</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p><strong>The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.</strong></p>
              <p>Mathematically: F = ma</p>
              <p>Where F is the net force, m is the mass, and a is the acceleration.</p>
            </div>
            
            <p>This law allows us to calculate how objects will accelerate when forces are applied to them.</p>
            
            <p><strong>Engineering Applications:</strong></p>
            <ul>
              <li>Designing propulsion systems for vehicles</li>
              <li>Calculating structural loads in buildings and bridges</li>
              <li>Designing control systems for robots and machinery</li>
            </ul>
            
            <h4>Third Law: Action and Reaction</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p><strong>For every action, there is an equal and opposite reaction.</strong></p>
              <p>When one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.</p>
            </div>
            
            <p><strong>Engineering Applications:</strong></p>
            <ul>
              <li>Rocket propulsion (expelling gas creates forward thrust)</li>
              <li>Recoil in firearms</li>
              <li>Walking (pushing backward on the ground propels us forward)</li>
              <li>Structural analysis (internal forces in beams and columns)</li>
            </ul>
          `,
        },
        {
          title: "Force Analysis and Free Body Diagrams",
          content: `
            <h3>Force Analysis and Free Body Diagrams</h3>
            <p>Free body diagrams (FBDs) are visual tools that help engineers analyze the forces acting on an object. They are essential for applying Newton's laws to solve mechanics problems.</p>
            
            <h4>Creating a Free Body Diagram</h4>
            <ol>
              <li>Isolate the object of interest</li>
              <li>Represent the object as a point or simple shape</li>
              <li>Identify all external forces acting on the object</li>
              <li>Draw arrows representing each force (length proportional to magnitude)</li>
              <li>Label each force with its magnitude and direction</li>
              <li>Establish a coordinate system</li>
            </ol>
            
            <h4>Common Forces in Engineering</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <ul>
                <li><strong>Weight (W = mg)</strong>: The gravitational force acting on an object's mass</li>
                <li><strong>Normal Force (N)</strong>: The perpendicular force exerted by a surface</li>
                <li><strong>Friction (F = μN)</strong>: The force that opposes motion between surfaces</li>
                <li><strong>Tension (T)</strong>: The pulling force exerted by a string, cable, or rope</li>
                <li><strong>Spring Force (F = kx)</strong>: The force exerted by a compressed or stretched spring</li>
                <li><strong>Applied Forces</strong>: External forces deliberately applied to an object</li>
              </ul>
            </div>
            
            <h4>Analyzing Forces</h4>
            <p>Once all forces are identified on the FBD, apply Newton's Second Law:</p>
            <ol>
              <li>Break forces into components along coordinate axes</li>
              <li>Sum forces in each direction: ΣFx = max and ΣFy = may</li>
              <li>For objects in equilibrium: ΣF = 0 (no acceleration)</li>
              <li>Solve the resulting equations for unknown quantities</li>
            </ol>
            
            <h4>Engineering Applications</h4>
            <ul>
              <li>Structural analysis of trusses, beams, and frames</li>
              <li>Vehicle dynamics and suspension design</li>
              <li>Mechanical linkage and mechanism design</li>
              <li>Robotics and control systems</li>
            </ul>
          `,
        },
        {
          title: "Friction and Its Engineering Applications",
          content: `
            <h3>Friction and Its Engineering Applications</h3>
            <p>Friction is the force that opposes the relative motion or tendency of motion between two surfaces in contact. Understanding friction is crucial in engineering design, as it can be either beneficial or detrimental depending on the application.</p>
            
            <h4>Types of Friction</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <ul>
                <li><strong>Static Friction (Fs)</strong>: Opposes the initiation of motion between stationary surfaces
                  <ul>
                    <li>Maximum value: Fs,max = μs·N (where μs is the coefficient of static friction)</li>
                    <li>Actual value: Fs ≤ μs·N (depends on applied force)</li>
                  </ul>
                </li>
                <li><strong>Kinetic Friction (Fk)</strong>: Opposes motion between surfaces that are moving relative to each other
                  <ul>
                    <li>Fk = μk·N (where μk is the coefficient of kinetic friction)</li>
                    <li>Generally, μk < μs (kinetic friction is usually less than static friction)</li>
                  </ul>
                </li>
                <li><strong>Rolling Friction</strong>: Opposes the rolling motion of an object
                  <ul>
                    <li>Much smaller than sliding friction</li>
                    <li>Caused by deformation of surfaces and other factors</li>
                  </ul>
                </li>
                <li><strong>Fluid Friction</strong>: Opposes motion through fluids (liquids or gases)
                  <ul>
                    <li>Depends on object shape, fluid properties, and velocity</li>
                    <li>Studied in fluid dynamics (drag forces)</li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <h4>Factors Affecting Friction</h4>
            <ul>
              <li>Surface roughness and texture</li>
              <li>Materials in contact</li>
              <li>Normal force between surfaces</li>
              <li>Presence of lubricants</li>
              <li>Temperature and environmental conditions</li>
            </ul>
            
            <h4>Engineering Applications: Utilizing Friction</h4>
            <ul>
              <li><strong>Braking Systems</strong>: Vehicle brakes convert kinetic energy to heat through friction</li>
              <li><strong>Clutches and Transmissions</strong>: Transfer power between components</li>
              <li><strong>Belt and Pulley Systems</strong>: Friction enables power transmission</li>
              <li><strong>Tires and Road Surfaces</strong>: Designed to maximize traction</li>
              <li><strong>Fasteners</strong>: Screws, bolts, and nuts rely on friction to prevent loosening</li>
            </ul>
            
            <h4>Engineering Applications: Reducing Friction</h4>
            <ul>
              <li><strong>Lubrication</strong>: Oils and greases reduce friction in bearings and engines</li>
              <li><strong>Bearings</strong>: Ball, roller, or fluid bearings minimize friction in rotating machinery</li>
              <li><strong>Material Selection</strong>: Low-friction materials like PTFE (Teflon)</li>
              <li><strong>Surface Treatments</strong>: Polishing, coating, or texturing surfaces</li>
              <li><strong>Air Cushions</strong>: Hovercraft and air hockey tables use air to eliminate contact</li>
            </ul>
          `,
        },
        {
          title: "Equilibrium Conditions",
          content: `
            <h3>Equilibrium Conditions</h3>
            <p>An object is in equilibrium when it has no acceleration - either at rest (static equilibrium) or moving with constant velocity (dynamic equilibrium). Understanding equilibrium is crucial for analyzing structures and mechanical systems.</p>
            
            <h4>Conditions for Equilibrium</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p>For an object to be in equilibrium, two conditions must be satisfied:</p>
              <ol>
                <li><strong>Force Equilibrium</strong>: The vector sum of all forces must be zero
                  <ul>
                    <li>ΣFx = 0 (sum of forces in x-direction)</li>
                    <li>ΣFy = 0 (sum of forces in y-direction)</li>
                    <li>ΣFz = 0 (sum of forces in z-direction)</li>
                  </ul>
                </li>
                <li><strong>Moment Equilibrium</strong>: The vector sum of all torques (moments) must be zero
                  <ul>
                    <li>ΣMx = 0 (sum of moments about x-axis)</li>
                    <li>ΣMy = 0 (sum of moments about y-axis)</li>
                    <li>ΣMz = 0 (sum of moments about z-axis)</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <h4>Analyzing Equilibrium Problems</h4>
            <ol>
              <li>Draw a free body diagram showing all forces and their points of application</li>
              <li>Choose a convenient coordinate system</li>
              <li>Apply force equilibrium equations (ΣF = 0)</li>
              <li>Choose reference points for moment calculations</li>
              <li>Apply moment equilibrium equations (ΣM = 0)</li>
              <li>Solve the resulting system of equations</li>
            </ol>
            
            <h4>Engineering Applications</h4>
            <ul>
              <li><strong>Structural Analysis</strong>: Determining forces in beams, columns, trusses, and frames</li>
              <li><strong>Bridge Design</strong>: Calculating loads and support reactions</li>
              <li><strong>Mechanical Systems</strong>: Analyzing levers, pulleys, and linkages</li>
              <li><strong>Stability Analysis</strong>: Determining when structures might tip over</li>
              <li><strong>Biomechanics</strong>: Analyzing forces in joints and muscles</li>
            </ul>
            
            <h4>Example: Beam in Equilibrium</h4>
            <p>Consider a beam supported at both ends with a weight in the middle:</p>
            <ul>
              <li>Force equilibrium: R₁ + R₂ = W (where R₁ and R₂ are support reactions, W is weight)</li>
              <li>Moment equilibrium about left support: R₂·L = W·(L/2) (where L is beam length)</li>
              <li>Solving: R₁ = R₂ = W/2 (each support bears half the weight)</li>
            </ul>
          `,
        },
        {
          title: "Work, Energy, and Power",
          content: `
            <h3>Work, Energy, and Power</h3>
            <p>Work, energy, and power are fundamental concepts in physics and engineering that provide alternative methods for analyzing mechanical systems, often simplifying problems that would be complex using force-based approaches.</p>
            
            <h4>Work</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p><strong>Definition</strong>: Work is done when a force causes displacement in the direction of the force.</p>
              <p><strong>Formula</strong>: W = F·d·cos(θ)</p>
              <p>Where:</p>
              <ul>
                <li>W = work (joules, J)</li>
                <li>F = force (newtons, N)</li>
                <li>d = displacement (meters, m)</li>
                <li>θ = angle between force and displacement vectors</li>
              </ul>
              <p><strong>Key Points</strong>:</p>
              <ul>
                <li>Work is a scalar quantity (has magnitude but no direction)</li>
                <li>Work can be positive, negative, or zero</li>
                <li>No work is done if there is no displacement or if force is perpendicular to displacement</li>
              </ul>
            </div>
            
            <h4>Energy</h4>
            <p><strong>Definition</strong>: Energy is the capacity to do work. It exists in various forms that can be converted from one to another.</p>
            
            <p><strong>Types of Mechanical Energy</strong>:</p>
            <ul>
              <li><strong>Kinetic Energy (KE)</strong>: Energy of motion
                <ul>
                  <li>KE = ½mv² (where m is mass, v is velocity)</li>
                  <li>Rotational KE = ½Iω² (where I is moment of inertia, ω is angular velocity)</li>
                </ul>
              </li>
              <li><strong>Potential Energy (PE)</strong>: Stored energy due to position or configuration
                <ul>
                  <li>Gravitational PE = mgh (where m is mass, g is gravitational acceleration, h is height)</li>
                  <li>Elastic PE = ½kx² (where k is spring constant, x is displacement from equilibrium)</li>
                </ul>
              </li>
            </ul>
            
            <p><strong>Conservation of Energy</strong>: In an isolated system, the total energy remains constant. Energy can be transformed from one form to another but cannot be created or destroyed.</p>
            
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p>For a conservative system: KE₁ + PE₁ = KE₂ + PE₂</p>
            </div>
            
            <h4>Power</h4>
            <div class="bg-secondary/30 p-4 rounded-md my-4">
              <p><strong>Definition</strong>: Power is the rate at which work is done or energy is transferred.</p>
              <p><strong>Formula</strong>: P = W/t = F·v</p>
              <p>Where:</p>
              <ul>
                <li>P = power (watts, W)</li>
                <li>W = work (joules, J)</li>
                <li>t = time (seconds, s)</li>
                <li>F = force (newtons, N)</li>
                <li>v = velocity (meters per second, m/s)</li>
              </ul>
            </div>
            
            <h4>Engineering Applications</h4>
            <ul>
              <li><strong>Machine Design</strong>: Calculating power requirements for motors and engines</li>
              <li><strong>Energy Storage Systems</strong>: Batteries, flywheels, pumped hydro storage</li>
              <li><strong>Vehicle Performance</strong>: Acceleration, braking, and efficiency analysis</li>
              <li><strong>Structural Analysis</strong>: Using energy methods to analyze deformations</li>
              <li><strong>Impact Analysis</strong>: Calculating energy absorption in collisions</li>
              <li><strong>Renewable Energy</strong>: Designing wind turbines, solar systems, and hydroelectric plants</li>
            </ul>
          `,
        },
      ],
      summary: `
        <h3>Module Summary</h3>
        <p>In this module, we've explored the fundamental principles of mechanics that are essential for engineering applications:</p>
        
        <ul>
          <li><strong>Newton's Three Laws of Motion</strong> provide the foundation for understanding how objects move under the influence of forces.</li>
          <li><strong>Free Body Diagrams</strong> are powerful tools for visualizing and analyzing the forces acting on objects.</li>
          <li><strong>Friction</strong> plays a crucial role in many engineering systems, sometimes beneficial and sometimes detrimental.</li>
          <li><strong>Equilibrium Conditions</strong> allow engineers to analyze structures and systems that are not accelerating.</li>
          <li><strong>Work, Energy, and Power</strong> concepts provide alternative approaches to solving mechanics problems.</li>
        </ul>
        
        <div class="bg-primary/10 p-4 rounded-md my-4">
          <h4>Key Takeaways</h4>
          <ul>
            <li>Always start mechanics problems by identifying all forces and drawing a free body diagram</li>
            <li>Consider both force and moment equilibrium when analyzing structures</li>
            <li>Energy approaches often simplify problems that would be complex using force-based methods</li>
            <li>Friction forces depend on the normal force and surface properties</li>
            <li>Power considerations are crucial for designing systems with time constraints</li>
          </ul>
        </div>
        
        <p>These mechanics principles form the foundation for many engineering disciplines and will be applied throughout your engineering career. You're now ready to test your understanding with the module quiz.</p>
      `,
    },
  },
]

export default function EngineerReviewerPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = Number.parseInt(params.id as string)

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)

  // Find the module
  const module = engineerModules.find((m) => m.id === moduleId)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push(`/login-page?redirect=/career-paths/engineer/reviewer/${moduleId}`)
          return
        }

        setUser(currentUser)

        // Check if module is unlocked
        const moduleUnlocked = await isModuleUnlocked(currentUser.id, "engineer", moduleId)

        if (!moduleUnlocked && moduleId !== 1) {
          router.push("/career-paths/engineer")
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [moduleId, router])

  if (loading) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-6">The module you're looking for doesn't exist.</p>
          <Link href="/career-paths/engineer">
            <Button>Back to Engineer Path</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleNextSection = () => {
    if (activeSection < module.reviewer.sections.length) {
      setActiveSection(activeSection + 1)
      // Scroll to top when changing sections
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
      // Scroll to top when changing sections
      window.scrollTo(0, 0)
    }
  }

  const handleTakeQuiz = () => {
    router.push(`/career-paths/engineer/module/${moduleId}`)
  }

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <Link href="/career-paths/engineer" className="mr-0 md:mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{module.title}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{module.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Module Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button
                  variant={activeSection === -1 ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setActiveSection(-1)
                    window.scrollTo(0, 0)
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Introduction
                </Button>

                {module.reviewer.sections.map((section, index) => (
                  <Button
                    key={index}
                    variant={activeSection === index ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setActiveSection(index)
                      window.scrollTo(0, 0)
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {section.title}
                  </Button>
                ))}

                <Button
                  variant={activeSection === module.reviewer.sections.length ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setActiveSection(module.reviewer.sections.length)
                    window.scrollTo(0, 0)
                  }}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Summary
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleTakeQuiz} className="w-full">
                Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <Card>
            <CardContent className="pt-6">
              {activeSection === -1 ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: module.reviewer.introduction }}
                ></div>
              ) : activeSection === module.reviewer.sections.length ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: module.reviewer.summary }}></div>
              ) : (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: module.reviewer.sections[activeSection].content }}
                ></div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousSection} disabled={activeSection === -1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {activeSection === module.reviewer.sections.length ? (
                <Button onClick={handleTakeQuiz}>
                  Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleNextSection} disabled={activeSection === module.reviewer.sections.length}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
