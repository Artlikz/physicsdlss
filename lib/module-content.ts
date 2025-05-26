export interface ModuleConcept {
  title: string
  summary: string
  keyPoints: string[]
  formulas?: string[]
  applications: string[]
  learningObjectives: string[]
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface ModuleQuiz {
  questions: QuizQuestion[]
  passingScore: number
}

export interface Activity {
  id: number
  title: string
  description: string
  type: "simulation" | "calculation" | "experiment" | "analysis"
  difficulty: "beginner" | "intermediate" | "advanced"
}

export interface ModuleContent {
  concept: ModuleConcept
  quiz: ModuleQuiz
  activities: Activity[]
}

export function getModuleContent(careerPath: "doctor" | "pilot", moduleId: number): ModuleContent | null {
  if (careerPath === "doctor") {
    return getDoctorModuleContent(moduleId)
  } else if (careerPath === "pilot") {
    return getPilotModuleContent(moduleId)
  }
  return null
}

function getDoctorModuleContent(moduleId: number): ModuleContent | null {
  const modules: Record<number, ModuleContent> = {
    1: {
      concept: {
        title: "Biomechanics and Body Movement",
        summary:
          "Biomechanics is the study of the mechanical principles that govern human movement. It combines principles from physics, engineering, and anatomy to understand how forces interact within the body during motion. This field analyzes how muscles, bones, tendons, and ligaments work together to produce movement, maintain posture, and respond to physical forces.",
        keyPoints: [
          "Kinematics – the study of motion without considering its causes (e.g., joint angles, velocity, and acceleration)",
          "Kinetics – the study of forces that cause movement (e.g., gravity, friction, muscle force)",
          "Levers in the body – bones act as levers and joints as fulcrums to create efficient movement",
          "Center of gravity and balance – essential for understanding stability and coordination in body movement",
        ],
        formulas: [
          "Force = Mass × Acceleration (F = ma)",
          "Torque = Force × Distance (τ = F × d)",
          "Work = Force × Distance (W = F × d)",
          "Power = Work / Time (P = W/t)",
        ],
        applications: [
          "Physical therapy and rehabilitation",
          "Sports performance optimization",
          "Injury prevention and analysis",
          "Ergonomic design",
          "Prosthetic and orthotic development",
        ],
        learningObjectives: [
          "Understand the fundamental principles of biomechanics",
          "Analyze human movement using kinematic and kinetic principles",
          "Apply lever systems to understand joint mechanics",
          "Evaluate movement efficiency and safety",
        ],
      },
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is the main purpose of studying biomechanics in human movement?",
            options: [
              "To improve memory and concentration",
              "To understand how the heart pumps blood",
              "To analyze how physical forces affect body movement",
              "To increase muscle size only",
            ],
            correctAnswer: 2,
            explanation:
              "Biomechanics studies how physical forces interact with the body to produce movement, helping us understand efficiency, safety, and effectiveness of physical actions.",
          },
          {
            id: 2,
            question: "Which of the following best describes a lever in the human body?",
            options: [
              "A muscle that contracts",
              "A joint that moves side to side",
              "A rigid structure like a bone that rotates around a fulcrum",
              "A tendon that pulls the bone",
            ],
            correctAnswer: 2,
            explanation:
              "In the human body, bones act as levers (rigid structures) that rotate around joints (fulcrums) to create efficient movement.",
          },
          {
            id: 3,
            question: "What does kinematics study in biomechanics?",
            options: [
              "The chemical structure of muscle fibers",
              "The forces that cause movement",
              "The motion of objects without considering the forces",
              "The emotional response to physical activity",
            ],
            correctAnswer: 2,
            explanation:
              "Kinematics focuses on describing motion (position, velocity, acceleration) without analyzing the forces that cause the motion.",
          },
          {
            id: 4,
            question: "What is the term for the force that causes rotation in body movement?",
            options: ["Acceleration", "Torque", "Resistance", "Friction"],
            correctAnswer: 1,
            explanation:
              "Torque is the rotational force that causes objects to rotate around an axis, essential for understanding joint movement.",
          },
          {
            id: 5,
            question:
              "Which movement describes a decrease in the angle between two body parts, such as bending the elbow?",
            options: ["Extension", "Flexion", "Rotation", "Abduction"],
            correctAnswer: 1,
            explanation:
              "Flexion is the movement that decreases the angle between two body parts, like bending the elbow or knee.",
          },
        ],
        passingScore: 80,
      },
      activities: [
        {
          id: 1,
          title: "Gait Analysis Simulation",
          description: "Analyze walking patterns and identify biomechanical inefficiencies",
          type: "simulation",
          difficulty: "intermediate",
        },
        {
          id: 2,
          title: "Lever System Calculations",
          description: "Calculate mechanical advantage in different joint systems",
          type: "calculation",
          difficulty: "beginner",
        },
        {
          id: 3,
          title: "Force Plate Experiment",
          description: "Measure ground reaction forces during various movements",
          type: "experiment",
          difficulty: "advanced",
        },
      ],
    },
    2: {
      concept: {
        title: "Medical Imaging and Radiation Physics",
        summary:
          "Medical Imaging and Radiation Physics is an interdisciplinary field focusing on the use of ionizing and non-ionizing radiation to diagnose, monitor, and treat diseases. It encompasses the scientific principles behind the generation, interaction, and detection of radiation and its application in medical diagnostics and therapy.",
        keyPoints: [
          "X-ray Radiography – Uses X-rays to image bones and internal organs",
          "Computed Tomography (CT) – Combines multiple X-ray images for cross-sectional views",
          "Magnetic Resonance Imaging (MRI) – Employs magnetic fields and radio waves for soft tissue imaging",
          "Ultrasound – Uses high-frequency sound waves to visualize soft tissues, organs, and blood flow",
          "Nuclear Medicine Imaging (PET/SPECT) – Involves radioactive tracers to evaluate organ function",
        ],
        formulas: [
          "Energy = Planck's constant × Frequency (E = hf)",
          "Half-life = 0.693 / Decay constant (t₁/₂ = 0.693/λ)",
          "Intensity = Power / Area (I = P/A)",
          "Attenuation = I₀ × e^(-μx)",
        ],
        applications: [
          "Diagnostic imaging for disease detection",
          "Cancer treatment through radiotherapy",
          "Image-guided surgical procedures",
          "Radiation safety and protection",
          "Quality assurance in medical imaging",
        ],
        learningObjectives: [
          "Understand different medical imaging modalities",
          "Analyze radiation-matter interactions",
          "Apply radiation safety principles",
          "Evaluate image quality and optimization",
        ],
      },
      quiz: {
        questions: [
          {
            id: 1,
            question: "Which of the following imaging techniques uses ionizing radiation?",
            options: ["Magnetic Resonance Imaging (MRI)", "Ultrasound", "X-ray Radiography", "Thermography"],
            correctAnswer: 2,
            explanation:
              "X-ray radiography uses ionizing radiation (X-rays) to create images, while MRI uses magnetic fields and ultrasound uses sound waves.",
          },
          {
            id: 2,
            question: "In computed tomography (CT), what is the main advantage over traditional X-rays?",
            options: [
              "It avoids the use of radiation",
              "It provides 3D cross-sectional images of the body",
              "It uses sound waves for imaging",
              "It only requires a single image to diagnose all diseases",
            ],
            correctAnswer: 1,
            explanation:
              "CT scans provide detailed 3D cross-sectional images by combining multiple X-ray images taken from different angles.",
          },
          {
            id: 3,
            question:
              "Which interaction of X-ray photons with matter is primarily responsible for image contrast in diagnostic radiography?",
            options: ["Pair production", "Photoelectric effect", "Nuclear fission", "Compton scattering"],
            correctAnswer: 1,
            explanation:
              "The photoelectric effect is the primary interaction responsible for image contrast in diagnostic X-ray imaging.",
          },
          {
            id: 4,
            question: "What is the primary concern of radiation dosimetry in medical physics?",
            options: [
              "Measuring the resolution of medical images",
              "Calculating the cost of radiation treatment",
              "Determining the amount of radiation absorbed by tissues",
              "Increasing the radiation exposure for clearer images",
            ],
            correctAnswer: 2,
            explanation:
              "Radiation dosimetry focuses on measuring and calculating the amount of radiation dose absorbed by tissues to ensure safety.",
          },
          {
            id: 5,
            question:
              "Which medical imaging technique is best suited for viewing soft tissues like the brain and muscles?",
            options: ["X-ray", "CT scan", "MRI", "PET scan"],
            correctAnswer: 2,
            explanation:
              "MRI provides excellent soft tissue contrast and is ideal for imaging the brain, muscles, and other soft tissues.",
          },
        ],
        passingScore: 80,
      },
      activities: [
        {
          id: 1,
          title: "X-ray Attenuation Simulation",
          description: "Simulate how X-rays are attenuated by different tissues",
          type: "simulation",
          difficulty: "intermediate",
        },
        {
          id: 2,
          title: "Radiation Dose Calculations",
          description: "Calculate radiation doses for different imaging procedures",
          type: "calculation",
          difficulty: "advanced",
        },
        {
          id: 3,
          title: "Image Quality Analysis",
          description: "Analyze and optimize medical image quality parameters",
          type: "analysis",
          difficulty: "intermediate",
        },
      ],
    },
  }

  return modules[moduleId] || null
}

function getPilotModuleContent(moduleId: number): ModuleContent | null {
  const modules: Record<number, ModuleContent> = {
    1: {
      concept: {
        title: "Principles of Flight and Aerodynamics",
        summary:
          "The principle of flight and aerodynamics explains how objects, especially aircraft, move through the air. Flight is governed by four fundamental aerodynamic forces: lift, weight, thrust, and drag. Understanding these principles is crucial for designing aircraft, improving performance, and ensuring safe and efficient flight.",
        keyPoints: [
          "Lift – The upward force that counteracts gravity, generated by wings based on Bernoulli's Principle and Newton's Third Law",
          "Weight (Gravity) – The downward force caused by Earth's gravitational pull",
          "Thrust – The forward force produced by engines or propellers",
          "Drag – The resistance force acting opposite to the direction of motion",
          "Angle of Attack – The angle between the wing and oncoming air, affects lift generation",
        ],
        formulas: [
          "Lift = ½ × ρ × V² × S × CL",
          "Drag = ½ × ρ × V² × S × CD",
          "Thrust = Mass flow rate × Velocity change",
          "L/D Ratio = Lift / Drag",
        ],
        applications: [
          "Aircraft design and optimization",
          "Flight performance calculations",
          "Fuel efficiency improvements",
          "Safety margin determinations",
          "Weather impact assessments",
        ],
        learningObjectives: [
          "Understand the four forces of flight",
          "Analyze airfoil design and performance",
          "Apply Bernoulli's principle to flight",
          "Evaluate aircraft stability and control",
        ],
      },
      quiz: {
        questions: [
          {
            id: 1,
            question: "Which force must be greater than weight for an aircraft to climb?",
            options: ["Drag", "Thrust", "Lift", "Gravity"],
            correctAnswer: 2,
            explanation:
              "For an aircraft to climb, lift must exceed weight to provide the net upward force needed for ascent.",
          },
          {
            id: 2,
            question: "What is the primary purpose of an aircraft's ailerons?",
            options: [
              "Control pitch (up and down)",
              "Increase lift during takeoff",
              "Control roll (tilting wings side to side)",
              "Reduce drag",
            ],
            correctAnswer: 2,
            explanation:
              "Ailerons are control surfaces that control the aircraft's roll movement by creating differential lift on the wings.",
          },
          {
            id: 3,
            question: "According to Bernoulli's Principle, how does faster air movement over a wing affect pressure?",
            options: [
              "Increases pressure above the wing",
              "Decreases pressure above the wing",
              "Has no effect on pressure",
              "Increases drag",
            ],
            correctAnswer: 1,
            explanation:
              "Bernoulli's Principle states that faster-moving air has lower pressure, creating a pressure difference that contributes to lift.",
          },
          {
            id: 4,
            question: "What happens if the angle of attack becomes too steep?",
            options: [
              "Lift increases infinitely",
              "Thrust becomes zero",
              "The aircraft speeds up",
              "The wing stalls and loses lift",
            ],
            correctAnswer: 3,
            explanation:
              "When the angle of attack exceeds the critical angle, airflow separates from the wing surface, causing a stall and loss of lift.",
          },
          {
            id: 5,
            question: "Which of the following forces always opposes the aircraft's motion through the air?",
            options: ["Thrust", "Lift", "Drag", "Weight"],
            correctAnswer: 2,
            explanation:
              "Drag is the aerodynamic force that always acts opposite to the direction of motion, resisting the aircraft's movement through the air.",
          },
        ],
        passingScore: 80,
      },
      activities: [
        {
          id: 1,
          title: "Wing Design Simulation",
          description: "Design and test different wing configurations for optimal performance",
          type: "simulation",
          difficulty: "intermediate",
        },
        {
          id: 2,
          title: "Force Balance Calculations",
          description: "Calculate the four forces of flight for different flight conditions",
          type: "calculation",
          difficulty: "beginner",
        },
        {
          id: 3,
          title: "Wind Tunnel Experiment",
          description: "Analyze airflow patterns around different airfoil shapes",
          type: "experiment",
          difficulty: "advanced",
        },
      ],
    },
    2: {
      concept: {
        title: "Atmospheric Physics and Weather Patterns",
        summary:
          "Atmospheric physics is the study of the physical processes and properties of Earth's atmosphere. It explains how energy, matter, and forces interact in the atmosphere to produce weather patterns and influence climate. Understanding these concepts is essential for weather forecasting, flight planning, and aviation safety.",
        keyPoints: [
          "Atmospheric Structure – Troposphere, stratosphere, mesosphere, thermosphere, and exosphere layers",
          "Radiation and Energy Transfer – Solar heating, conduction, convection, and radiation processes",
          "Pressure and Temperature – Air pressure decreases with altitude, temperature affects air density",
          "Wind Formation – Air movement from high to low pressure, influenced by Coriolis effect",
          "Weather Fronts – Boundaries between air masses that create weather changes",
        ],
        formulas: [
          "Pressure Altitude = (29.92 - Current Pressure) × 1000",
          "Density Altitude = Pressure Altitude + (120 × (OAT - ISA))",
          "Wind Speed = √(u² + v²)",
          "Coriolis Force = 2 × Ω × V × sin(φ)",
        ],
        applications: [
          "Weather forecasting and analysis",
          "Flight planning and route optimization",
          "Turbulence prediction and avoidance",
          "Icing condition assessment",
          "Visibility and ceiling determination",
        ],
        learningObjectives: [
          "Understand atmospheric structure and properties",
          "Analyze weather pattern formation",
          "Apply meteorological principles to aviation",
          "Evaluate weather hazards for flight safety",
        ],
      },
      quiz: {
        questions: [
          {
            id: 1,
            question: "Which layer of the atmosphere contains most of the Earth's weather events?",
            options: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"],
            correctAnswer: 1,
            explanation:
              "The troposphere is the lowest layer of the atmosphere where most weather phenomena occur due to temperature and pressure variations.",
          },
          {
            id: 2,
            question: "What is the primary cause of wind on Earth?",
            options: ["Earth's rotation", "Differences in air pressure", "Ocean currents", "Moon's gravitational pull"],
            correctAnswer: 1,
            explanation:
              "Wind is primarily caused by air moving from areas of high pressure to areas of low pressure to equalize pressure differences.",
          },
          {
            id: 3,
            question: "What is the Coriolis effect responsible for?",
            options: [
              "Causing global warming",
              "Heating the atmosphere",
              "Deflecting wind direction due to Earth's rotation",
              "Increasing air pressure",
            ],
            correctAnswer: 2,
            explanation:
              "The Coriolis effect deflects moving air masses due to Earth's rotation, influencing wind patterns and weather systems.",
          },
          {
            id: 4,
            question: "Which of the following correctly describes a cold front?",
            options: [
              "Warm air slowly rises over cold air",
              "Cold air displaces warm air quickly, often causing storms",
              "Two similar air masses meet with little movement",
              "A boundary where warm air replaces cold air",
            ],
            correctAnswer: 1,
            explanation:
              "A cold front occurs when cold air mass displaces warm air rapidly, often creating turbulent weather and storms.",
          },
          {
            id: 5,
            question: "Why does rising air cool and lead to cloud formation?",
            options: [
              "Because clouds are cold by nature",
              "Because sunlight stops reaching higher altitudes",
              "Due to the decrease in pressure at higher altitudes causing expansion and cooling",
              "Because water vapor heats up as it rises",
            ],
            correctAnswer: 2,
            explanation:
              "As air rises to higher altitudes, it encounters lower pressure, causing it to expand and cool, leading to condensation and cloud formation.",
          },
        ],
        passingScore: 80,
      },
      activities: [
        {
          id: 1,
          title: "Weather Pattern Analysis",
          description: "Analyze real weather data to predict flight conditions",
          type: "analysis",
          difficulty: "intermediate",
        },
        {
          id: 2,
          title: "Pressure System Simulation",
          description: "Simulate the formation and movement of high and low pressure systems",
          type: "simulation",
          difficulty: "advanced",
        },
        {
          id: 3,
          title: "Atmospheric Calculations",
          description: "Calculate density altitude and its effects on aircraft performance",
          type: "calculation",
          difficulty: "intermediate",
        },
      ],
    },
  }

  return modules[moduleId] || null
}
