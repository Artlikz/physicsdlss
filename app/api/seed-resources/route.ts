import { NextResponse } from "next/server"
import { createLearningResource } from "@/lib/data-service"

// Sample resources data
const sampleResources = [
  {
    title: "Introduction to Physics for Engineers",
    description: "A comprehensive guide to basic physics concepts for engineering students",
    url: "https://example.com/physics-engineers",
    resource_type: "ebook",
    module_id: 1,
    career_path: "engineer",
  },
  {
    title: "Vector Mathematics for Engineers",
    description: "Learn how to work with vectors in engineering applications",
    url: "https://example.com/vector-math",
    resource_type: "video",
    module_id: 1,
    career_path: "engineer",
  },
  {
    title: "Basic Measurement Techniques",
    description: "Precision and accuracy in engineering measurements",
    url: "https://example.com/measurement",
    resource_type: "article",
    module_id: 1,
    career_path: "engineer",
  },
  {
    title: "Medical Physics Fundamentals",
    description: "Introduction to physics concepts essential for medical professionals",
    url: "https://example.com/medical-physics",
    resource_type: "ebook",
    module_id: 1,
    career_path: "doctor",
  },
  {
    title: "Aerodynamics Principles",
    description: "Understanding the physics of flight",
    url: "https://example.com/aerodynamics",
    resource_type: "video",
    module_id: 1,
    career_path: "pilot",
  },
]

export async function GET() {
  try {
    const results = []

    for (const resource of sampleResources) {
      const result = await createLearningResource(resource)
      results.push(result)
    }

    return NextResponse.json({
      success: true,
      message: "Sample resources created successfully",
      count: results.length,
      resources: results,
    })
  } catch (error) {
    console.error("Error seeding resources:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed resources",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
