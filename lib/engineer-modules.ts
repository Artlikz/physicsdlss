export interface EngineerModule {
  id: number
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  content: {
    summary: string
    keyPoints: string[]
    formulas: string[]
    applications: string[]
    learningObjectives: string[]
  }
  quiz: {
    questions: Array<{
      id: number
      question: string
      options: string[]
      correctAnswer: number
      explanation: string
    }>
    passingScore: number
  }
  activities: Array<{
    id: number
    title: string
    description: string
    type: "simulation" | "calculation" | "experiment" | "analysis"
    difficulty: "beginner" | "intermediate" | "advanced"
  }>
}

export const engineerModules: EngineerModule[] = [
  {
    id: 1,
    title: "Applied Mechanics and Material Properties",
    description: "Foundational principles of mechanics and material behavior in engineering applications",
    duration: "60 min",
    difficulty: "Intermediate",
    content: {
      summary:
        "Applied Mechanics is a foundational branch of physical science and engineering that deals with the practical application of mechanics to solve real-world problems. It helps engineers understand how physical systems behave under various forces and constraints, while Material Properties refer to the measurable characteristics that describe how materials respond to external conditions.",
      keyPoints: [
        "Statics - Study of bodies at rest, force analysis, and equilibrium conditions",
        "Dynamics - Study of bodies in motion, including kinematics and kinetics",
        "Strength of Materials - Internal effects of loads on materials and structures",
        "Mechanical Properties - Strength, elasticity, plasticity, ductility, and hardness",
        "Physical Properties - Density, thermal conductivity, electrical conductivity",
        "Chemical Properties - Corrosion resistance and material reactivity",
      ],
      formulas: [
        "Stress (σ) = Force (F) / Area (A)",
        "Strain (ε) = Change in Length (ΔL) / Original Length (L₀)",
        "Young's Modulus (E) = Stress / Strain",
        "Shear Stress (τ) = Shear Force / Area",
        "Moment (M) = Force × Distance",
      ],
      applications: [
        "Structural analysis of bridges and buildings",
        "Machine design and component selection",
        "Aerospace engineering load analysis",
        "Biomedical implant material selection",
        "Quality control in manufacturing",
      ],
      learningObjectives: [
        "Understand fundamental principles of statics and dynamics",
        "Analyze stress and strain in engineering materials",
        "Apply equilibrium conditions to solve engineering problems",
        "Select appropriate materials based on mechanical properties",
        "Evaluate material behavior under different loading conditions",
      ],
    },
    quiz: {
      questions: [
        {
          id: 1,
          question:
            "A beam is subjected to a uniform load. What type of stress is primarily experienced at the bottom fibers of the beam in a simple bending scenario?",
          options: ["Tensile stress", "Compressive stress", "Shear stress", "Torsional stress"],
          correctAnswer: 0,
          explanation:
            "In simple bending, the bottom fibers of a beam experience tensile stress as they are stretched, while the top fibers experience compressive stress.",
        },
        {
          id: 2,
          question:
            "Which of the following material properties best describes a metal that can be drawn into wires without breaking?",
          options: ["Toughness", "Hardness", "Ductility", "Brittleness"],
          correctAnswer: 2,
          explanation:
            "Ductility is the ability of a material to be drawn into wires or undergo plastic deformation without fracturing.",
        },
        {
          id: 3,
          question:
            "In statics, which of the following conditions must be satisfied for a body to be in complete equilibrium?",
          options: [
            "The sum of forces is zero",
            "The sum of moments is zero",
            "Both the sum of forces and moments are zero",
            "The net velocity is constant",
          ],
          correctAnswer: 2,
          explanation:
            "For complete equilibrium, both the sum of all forces and the sum of all moments about any point must equal zero.",
        },
        {
          id: 4,
          question: "A material that fractures suddenly with little to no deformation is described as:",
          options: ["Elastic", "Ductile", "Brittle", "Malleable"],
          correctAnswer: 2,
          explanation:
            "Brittle materials fracture suddenly with minimal plastic deformation, unlike ductile materials that deform significantly before failure.",
        },
        {
          id: 5,
          question: "Which testing method is most suitable to determine the hardness of a material?",
          options: ["Tensile test", "Charpy impact test", "Brinell or Rockwell test", "Fatigue test"],
          correctAnswer: 2,
          explanation:
            "Brinell and Rockwell tests measure hardness by indenting the material surface with a standardized indenter under specific loads.",
        },
      ],
      passingScore: 80,
    },
    activities: [
      {
        id: 1,
        title: "Stress-Strain Analysis",
        description: "Analyze stress-strain curves for different materials and determine mechanical properties",
        type: "analysis",
        difficulty: "intermediate",
      },
      {
        id: 2,
        title: "Beam Deflection Calculation",
        description: "Calculate deflections in simply supported and cantilever beams under various loading conditions",
        type: "calculation",
        difficulty: "advanced",
      },
      {
        id: 3,
        title: "Material Testing Simulation",
        description: "Simulate tensile, compression, and hardness tests to understand material behavior",
        type: "simulation",
        difficulty: "beginner",
      },
    ],
  },
  {
    id: 2,
    title: "Thermodynamics and Heat Transfer",
    description: "Energy systems, heat engines, and thermal processes in engineering applications",
    duration: "65 min",
    difficulty: "Advanced",
    content: {
      summary:
        "Thermodynamics is the study of energy, heat, and work, and how they interact within systems. Heat Transfer studies the mechanisms of thermal energy movement, essential for designing thermal systems like power plants, engines, and cooling systems.",
      keyPoints: [
        "Laws of Thermodynamics - Energy conservation and entropy principles",
        "Thermodynamic Systems - Open, closed, and isolated systems",
        "Heat Transfer Modes - Conduction, convection, and radiation",
        "Thermodynamic Processes - Isothermal, adiabatic, isobaric, and isochoric",
        "Heat Exchangers - Devices for efficient thermal energy transfer",
        "Phase Equilibria - Understanding phase changes and chemical reactions",
      ],
      formulas: [
        "First Law: ΔU = Q - W (Change in internal energy)",
        "Fourier's Law: q = -kA(dT/dx) (Heat conduction)",
        "Newton's Law of Cooling: q = hA(T₁ - T₂) (Convection)",
        "Stefan-Boltzmann Law: q = εσAT⁴ (Radiation)",
        "Carnot Efficiency: η = 1 - (T_cold/T_hot)",
      ],
      applications: [
        "Power plant design and optimization",
        "HVAC system engineering",
        "Internal combustion engine analysis",
        "Refrigeration and air conditioning",
        "Electronics cooling systems",
      ],
      learningObjectives: [
        "Apply the laws of thermodynamics to engineering systems",
        "Analyze heat transfer mechanisms in practical applications",
        "Design thermal systems for optimal efficiency",
        "Understand phase changes and their engineering implications",
        "Evaluate energy conversion processes",
      ],
    },
    quiz: {
      questions: [
        {
          id: 1,
          question:
            "Which thermodynamic potential is most useful for determining the spontaneity of a process at constant temperature and pressure?",
          options: ["Internal Energy", "Enthalpy", "Helmholtz Free Energy", "Gibbs Free Energy"],
          correctAnswer: 3,
          explanation:
            "Gibbs free energy (G) predicts spontaneity in processes occurring at constant temperature and pressure, typical in many chemical and biological systems.",
        },
        {
          id: 2,
          question:
            "In a steady-state heat conduction problem through a composite wall, which assumption is typically made to simplify the analysis?",
          options: [
            "Temperature varies with time",
            "Heat generation occurs within the wall",
            "Thermal conductivity is constant and uniform",
            "Heat is transferred only by convection",
          ],
          correctAnswer: 2,
          explanation:
            "For simplicity, conduction problems often assume constant thermal conductivity, and steady-state means no temperature changes over time.",
        },
        {
          id: 3,
          question:
            "The second law of thermodynamics implies which of the following about entropy in an isolated system?",
          options: [
            "Entropy decreases over time",
            "Entropy remains constant during irreversible processes",
            "Entropy tends to increase, indicating the direction of spontaneous processes",
            "Entropy is irrelevant in macroscopic systems",
          ],
          correctAnswer: 2,
          explanation:
            "The second law states that total entropy of an isolated system can only increase or remain constant, never decrease.",
        },
        {
          id: 4,
          question:
            "Which dimensionless number characterizes the ratio of momentum diffusivity to thermal diffusivity in convective heat transfer?",
          options: ["Reynolds Number", "Nusselt Number", "Prandtl Number", "Grashof Number"],
          correctAnswer: 2,
          explanation:
            "The Prandtl number compares the rate of momentum diffusion (viscosity) to thermal diffusion (heat conduction) in fluid flow.",
        },
        {
          id: 5,
          question: "In radiative heat transfer, the emissivity of a surface affects which of the following?",
          options: [
            "The surface's capacity to reflect radiation",
            "The rate at which the surface emits thermal radiation relative to a blackbody",
            "The conduction heat transfer through the surface",
            "The convective heat transfer coefficient",
          ],
          correctAnswer: 1,
          explanation:
            "Emissivity measures how efficiently a surface radiates energy compared to an ideal blackbody (which has emissivity = 1).",
        },
      ],
      passingScore: 80,
    },
    activities: [
      {
        id: 1,
        title: "Heat Engine Cycle Analysis",
        description: "Analyze different thermodynamic cycles and calculate their efficiency",
        type: "calculation",
        difficulty: "advanced",
      },
      {
        id: 2,
        title: "Heat Exchanger Design",
        description: "Design a heat exchanger for specific thermal requirements",
        type: "simulation",
        difficulty: "intermediate",
      },
      {
        id: 3,
        title: "Thermal Conductivity Experiment",
        description: "Measure thermal conductivity of different materials",
        type: "experiment",
        difficulty: "beginner",
      },
    ],
  },
  {
    id: 3,
    title: "Electrical Circuits and Electromagnetic Fields",
    description: "Circuit analysis, electromagnetic theory, and their engineering applications",
    duration: "55 min",
    difficulty: "Intermediate",
    content: {
      summary:
        "Electrical circuits provide pathways for electric current flow, while electromagnetic fields describe the interaction between electric and magnetic phenomena. Understanding both is crucial for designing electrical systems, motors, generators, and communication devices.",
      keyPoints: [
        "Circuit Components - Resistors, capacitors, inductors, and power sources",
        "Ohm's Law and Kirchhoff's Laws - Fundamental circuit analysis principles",
        "AC and DC Circuits - Different types of electrical systems",
        "Maxwell's Equations - Unifying electricity and magnetism",
        "Electromagnetic Induction - Basis for transformers and generators",
        "Electromagnetic Waves - Radio, microwave, and optical communications",
      ],
      formulas: [
        "Ohm's Law: V = IR",
        "Power: P = VI = I²R = V²/R",
        "Kirchhoff's Current Law: ΣI_in = ΣI_out",
        "Kirchhoff's Voltage Law: ΣV = 0 (around closed loop)",
        "Faraday's Law: ε = -dΦ/dt",
      ],
      applications: [
        "Power distribution systems",
        "Electric motor and generator design",
        "Communication system engineering",
        "Electronic device development",
        "Electromagnetic compatibility analysis",
      ],
      learningObjectives: [
        "Analyze DC and AC electrical circuits",
        "Apply Kirchhoff's laws to complex circuits",
        "Understand electromagnetic field interactions",
        "Design basic electrical systems",
        "Evaluate electromagnetic wave propagation",
      ],
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: "What does Ohm's Law state?",
          options: [
            "Voltage equals current times resistance",
            "Current equals voltage times resistance",
            "Resistance equals voltage divided by current squared",
            "Voltage equals resistance divided by current",
          ],
          correctAnswer: 0,
          explanation: "Ohm's Law states that voltage (V) equals current (I) times resistance (R): V = IR.",
        },
        {
          id: 2,
          question: "In a series circuit with three resistors, what is true about the current?",
          options: [
            "Current divides among the resistors",
            "Current is the same through all resistors",
            "Current is zero in one resistor",
            "Current is higher in the resistor with the highest resistance",
          ],
          correctAnswer: 1,
          explanation:
            "In a series circuit, the same current flows through all components since there is only one path for current flow.",
        },
        {
          id: 3,
          question: "According to Faraday's Law of Electromagnetic Induction, a changing magnetic field produces:",
          options: [
            "A constant electric field",
            "A changing electric field",
            "A magnetic monopole",
            "An electric current in a stationary conductor",
          ],
          correctAnswer: 1,
          explanation:
            "Faraday's Law states that a changing magnetic field induces an electric field, which can drive current in a conductor.",
        },
        {
          id: 4,
          question: "Which component stores energy in a magnetic field when current flows through it?",
          options: ["Resistor", "Capacitor", "Inductor", "Battery"],
          correctAnswer: 2,
          explanation:
            "An inductor stores energy in its magnetic field when current flows through it, similar to how a capacitor stores energy in an electric field.",
        },
        {
          id: 5,
          question: "Which of the following statements about electromagnetic waves is true?",
          options: [
            "They require a medium to travel through",
            "Electric and magnetic fields oscillate in the same direction",
            "They can propagate through a vacuum",
            "They only exist at visible light frequencies",
          ],
          correctAnswer: 2,
          explanation:
            "Electromagnetic waves can propagate through a vacuum and include radio waves, microwaves, visible light, X-rays, and gamma rays.",
        },
      ],
      passingScore: 80,
    },
    activities: [
      {
        id: 1,
        title: "Circuit Analysis Simulation",
        description: "Analyze complex circuits using simulation software",
        type: "simulation",
        difficulty: "intermediate",
      },
      {
        id: 2,
        title: "Electromagnetic Field Mapping",
        description: "Map electric and magnetic fields around different configurations",
        type: "experiment",
        difficulty: "advanced",
      },
      {
        id: 3,
        title: "Power Calculation Exercise",
        description: "Calculate power consumption in various electrical circuits",
        type: "calculation",
        difficulty: "beginner",
      },
    ],
  },
  {
    id: 4,
    title: "Fluid Dynamics and Mechanical Systems",
    description: "Fluid behavior, mechanical components, and their integration in engineering systems",
    duration: "50 min",
    difficulty: "Intermediate",
    content: {
      summary:
        "Fluid Dynamics studies the behavior of fluids in motion, while Mechanical Systems involve machines and mechanisms that transmit forces and motion. Together, they form the basis for hydraulic systems, turbomachinery, and fluid power applications.",
      keyPoints: [
        "Fluid Properties - Density, viscosity, pressure, and temperature effects",
        "Flow Types - Laminar vs. turbulent flow characteristics",
        "Bernoulli's Principle - Pressure-velocity relationships in flowing fluids",
        "Continuity Equation - Conservation of mass in fluid flow",
        "Mechanical Components - Gears, levers, pulleys, and linkages",
        "Power Transmission - Methods of transferring mechanical energy",
      ],
      formulas: [
        "Continuity Equation: ρ₁A₁V₁ = ρ₂A₂V₂",
        "Bernoulli's Equation: P₁ + ½ρV₁² + ρgh₁ = P₂ + ½ρV₂² + ρgh₂",
        "Reynolds Number: Re = ρVD/μ",
        "Mechanical Advantage: MA = Output Force / Input Force",
        "Power: P = Force × Velocity",
      ],
      applications: [
        "Hydraulic and pneumatic systems",
        "Pump and turbine design",
        "HVAC system engineering",
        "Automotive transmission systems",
        "Industrial machinery design",
      ],
      learningObjectives: [
        "Analyze fluid flow in pipes and channels",
        "Apply Bernoulli's principle to engineering problems",
        "Design mechanical systems for force and motion transmission",
        "Understand fluid-structure interactions",
        "Evaluate system efficiency and performance",
      ],
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: "What does Bernoulli's Principle state about the relationship between fluid velocity and pressure?",
          options: [
            "As fluid velocity increases, pressure increases",
            "As fluid velocity increases, pressure decreases",
            "Fluid velocity and pressure are always equal",
            "Pressure does not depend on fluid velocity",
          ],
          correctAnswer: 1,
          explanation:
            "Bernoulli's Principle states that as fluid velocity increases, pressure decreases, assuming constant elevation and no energy losses.",
        },
        {
          id: 2,
          question: "Which type of flow is characterized by smooth and orderly fluid motion?",
          options: ["Turbulent flow", "Laminar flow", "Chaotic flow", "Viscous flow"],
          correctAnswer: 1,
          explanation:
            "Laminar flow is characterized by smooth, orderly fluid motion in parallel layers with minimal mixing between layers.",
        },
        {
          id: 3,
          question: "What simple machine uses a wheel and a rope to lift heavy objects?",
          options: ["Lever", "Pulley", "Gear", "Inclined plane"],
          correctAnswer: 1,
          explanation:
            "A pulley is a simple machine that uses a wheel and rope system to change the direction of force and provide mechanical advantage.",
        },
        {
          id: 4,
          question: "In mechanical systems, what is the function of gears?",
          options: [
            "To convert electrical energy into mechanical energy",
            "To amplify force and change the direction or speed of motion",
            "To store energy temporarily",
            "To measure pressure in fluids",
          ],
          correctAnswer: 1,
          explanation:
            "Gears transmit power between shafts, providing mechanical advantage by changing force, speed, or direction of motion.",
        },
        {
          id: 5,
          question: "The Continuity Equation in fluid dynamics expresses the conservation of:",
          options: ["Energy", "Momentum", "Mass", "Pressure"],
          correctAnswer: 2,
          explanation:
            "The Continuity Equation is based on the conservation of mass, stating that mass flow rate must be constant in a steady flow system.",
        },
      ],
      passingScore: 80,
    },
    activities: [
      {
        id: 1,
        title: "Fluid Flow Simulation",
        description: "Simulate fluid flow through pipes and around obstacles",
        type: "simulation",
        difficulty: "intermediate",
      },
      {
        id: 2,
        title: "Gear Train Analysis",
        description: "Analyze gear ratios and mechanical advantage in gear systems",
        type: "calculation",
        difficulty: "beginner",
      },
      {
        id: 3,
        title: "Pump Performance Testing",
        description: "Test and analyze pump performance characteristics",
        type: "experiment",
        difficulty: "advanced",
      },
    ],
  },
  {
    id: 5,
    title: "Structural Analysis and Vibrations",
    description: "Structural behavior under loads and dynamic response analysis",
    duration: "70 min",
    difficulty: "Advanced",
    content: {
      summary:
        "Structural Analysis studies how structures respond to various loads to ensure safety and performance. Vibration Analysis examines the dynamic behavior of structures under time-varying forces, crucial for earthquake engineering and machine design.",
      keyPoints: [
        "Types of Structures - Beams, trusses, frames, cables, and arches",
        "Load Types - Dead, live, environmental, and dynamic loads",
        "Analysis Methods - Equilibrium, matrix methods, and computer analysis",
        "Vibration Types - Free, forced, damped, and undamped vibrations",
        "Natural Frequency and Resonance - Critical for avoiding structural failure",
        "Modal Analysis - Understanding complex vibration patterns",
      ],
      formulas: [
        "Bending Stress: σ = My/I",
        "Deflection: δ = PL³/(3EI) (cantilever beam)",
        "Natural Frequency: f = (1/2π)√(k/m)",
        "Damping Ratio: ζ = c/(2√(km))",
        "Resonance Condition: f_external = f_natural",
      ],
      applications: [
        "Building and bridge design",
        "Earthquake-resistant structures",
        "Machine foundation design",
        "Vibration control systems",
        "Dynamic analysis of rotating machinery",
      ],
      learningObjectives: [
        "Analyze structural responses to static and dynamic loads",
        "Design structures for safety and serviceability",
        "Understand vibration phenomena and control methods",
        "Apply matrix methods for complex structural analysis",
        "Evaluate structural stability and dynamic behavior",
      ],
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: "Which of the following structures is most commonly analyzed using the method of joints?",
          options: ["Beam", "Truss", "Frame", "Arch"],
          correctAnswer: 1,
          explanation:
            "The method of joints is specifically designed for analyzing forces in pin-jointed truss members by considering equilibrium at each joint.",
        },
        {
          id: 2,
          question: "Which of the following is an example of a dynamic load?",
          options: ["Weight of a building roof", "A parked vehicle", "Earthquake forces", "Wall partition"],
          correctAnswer: 2,
          explanation:
            "Earthquake forces change rapidly over time, making them dynamic loads that require special analysis methods.",
        },
        {
          id: 3,
          question:
            "In a simply supported beam with a central point load, where does the maximum bending moment occur?",
          options: ["At the supports", "At the midpoint", "One-third from the left support", "At the quarter span"],
          correctAnswer: 1,
          explanation:
            "For a point load at the center of a simply supported beam, the maximum bending moment occurs at the midpoint where the load is applied.",
        },
        {
          id: 4,
          question:
            "What type of vibration occurs when a structure is displaced and allowed to oscillate without continuous external force?",
          options: ["Forced vibration", "Resonance", "Free vibration", "Damped vibration"],
          correctAnswer: 2,
          explanation:
            "Free vibration occurs after an initial disturbance with no continuous external force, allowing the structure to vibrate at its natural frequency.",
        },
        {
          id: 5,
          question:
            "Why is it important to avoid matching a structure's natural frequency with that of external forces?",
          options: [
            "It leads to heat buildup",
            "It causes corrosion",
            "It can cause resonance and structural failure",
            "It wastes material",
          ],
          correctAnswer: 2,
          explanation:
            "When external force frequency matches natural frequency, resonance occurs, dramatically increasing vibration amplitude and potentially causing structural failure.",
        },
      ],
      passingScore: 80,
    },
    activities: [
      {
        id: 1,
        title: "Structural Analysis Software",
        description: "Use FEA software to analyze complex structures under various loading conditions",
        type: "simulation",
        difficulty: "advanced",
      },
      {
        id: 2,
        title: "Vibration Testing",
        description: "Measure natural frequencies and mode shapes of structural elements",
        type: "experiment",
        difficulty: "intermediate",
      },
      {
        id: 3,
        title: "Beam Design Calculations",
        description: "Design beams for specific loading conditions and safety factors",
        type: "calculation",
        difficulty: "intermediate",
      },
    ],
  },
]

export function getEngineerModule(moduleId: number): EngineerModule | null {
  return engineerModules.find((module) => module.id === moduleId) || null
}
