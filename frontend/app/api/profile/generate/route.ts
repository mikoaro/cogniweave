import { type NextRequest, NextResponse } from "next/server"
import type { CognitiveProfile } from "@/contexts/profile-context"

interface OnboardingData {
  readingStyle: string
  distractions: string
  complexTopics: string
  additionalNeeds: string[]
  learningEnvironment: string
  timePreference: string
  focusChallenges: string[]
}

// Mock Claude 3 profile generation based on the brainstorming document
function generateCognitiveProfile(data: OnboardingData): CognitiveProfile {
  // Analyze reading style preferences
  let chunkingStrategy: "sentence_limit" | "none" = "none"
  let maxLength = 5

  if (data.readingStyle === "short-paragraphs") {
    chunkingStrategy = "sentence_limit"
    maxLength = 3
  } else if (data.readingStyle === "bullet-points") {
    chunkingStrategy = "sentence_limit"
    maxLength = 2
  } else if (data.readingStyle === "single-sentences") {
    chunkingStrategy = "sentence_limit"
    maxLength = 1
  }

  // Analyze vocabulary simplification needs
  let simplificationLevel: "none" | "basic" | "intermediate" | "advanced" = "none"

  if (data.focusChallenges.includes("Difficulty with complex vocabulary")) {
    simplificationLevel = "intermediate"
  }
  if (data.complexTopics === "analogies") {
    simplificationLevel = "basic"
  }
  if (data.timePreference === "short-bursts") {
    simplificationLevel = "intermediate"
  }

  // Analyze distraction filtering needs
  let distractionEnabled = false
  let sensitivity: "low" | "medium" | "high" = "medium"

  if (data.distractions === "ads-images") {
    distractionEnabled = true
    sensitivity = "high"
  } else if (data.distractions === "sidebars") {
    distractionEnabled = true
    sensitivity = "medium"
  } else if (data.distractions === "animations") {
    distractionEnabled = true
    sensitivity = "high"
  }

  // Analyze summarization preferences
  let defaultState: "collapsed" | "expanded" = "expanded"
  let summaryLength = 100

  if (data.complexTopics === "summaries") {
    defaultState = "collapsed"
    summaryLength = 25
  }
  if (data.timePreference === "short-bursts") {
    summaryLength = 15
  }

  // Analyze analogy usage
  const useAnalogies = data.complexTopics === "analogies"

  // Set display preferences based on additional needs
  let fontSize = 16
  const lineHeight = 1.5
  let colorScheme: "default" | "high-contrast" | "warm" = "default"

  if (data.additionalNeeds.includes("Larger font sizes")) {
    fontSize = 18
  }
  if (data.additionalNeeds.includes("High contrast color schemes")) {
    colorScheme = "high-contrast"
  }

  return {
    text: {
      chunking: {
        strategy: chunkingStrategy,
        maxLength: maxLength,
      },
      vocabulary: {
        simplificationLevel: simplificationLevel,
      },
    },
    simplification: {
      useAnalogies: useAnalogies,
      summarization: {
        defaultState: defaultState,
        summaryLength: summaryLength,
      },
    },
    visuals: {
      distractionFilter: {
        enabled: distractionEnabled,
        sensitivity: sensitivity,
      },
    },
    preferences: {
      fontSize: fontSize,
      lineHeight: lineHeight,
      colorScheme: colorScheme,
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: OnboardingData = await request.json()

    // Simulate processing delay (like calling Claude 3 on Bedrock)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("test -data ttttt")
    console.log(data)

    // Generate cognitive profile using our mock logic
    const profile = generateCognitiveProfile(data)

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile generation error:", error)
    return NextResponse.json({ error: "Failed to generate profile" }, { status: 500 })
  }
}
