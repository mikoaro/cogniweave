import { type NextRequest, NextResponse } from "next/server"
import type { CognitiveProfile } from "@/contexts/profile-context"

interface TransformRequest {
  content: {
    title: string
    content: string
    sidebar: string
    images: string[]
  }
  profile: CognitiveProfile
}

// Mock content transformation based on cognitive profile
function transformContent(content: string, profile: CognitiveProfile) {
  const transformedChunks: string[] = []
  const simplifiedTerms: Array<{ original: string; simplified: string }> = []
  let analogies: string[] = []

  // Split content into paragraphs
  const paragraphs = content.split("\n\n")

  for (const paragraph of paragraphs) {
    let processedParagraph = paragraph

    // Apply vocabulary simplification
    if (profile.text.vocabulary.simplificationLevel !== "none") {
      const complexTerms = [
        { original: "paradigms", simplified: "ways of thinking" },
        { original: "counterintuitive", simplified: "surprising" },
        { original: "luminaries", simplified: "famous scientists" },
        { original: "probabilistic", simplified: "chance-based" },
        { original: "subatomic", simplified: "very tiny" },
        { original: "quanta", simplified: "small packets of energy" },
        { original: "superposition", simplified: "being in multiple states" },
        { original: "deterministic", simplified: "predictable" },
        { original: "entanglement", simplified: "mysterious connection" },
        { original: "non-local correlations", simplified: "instant connections" },
        { original: "formalism", simplified: "mathematical rules" },
        { original: "Hilbert spaces", simplified: "mathematical frameworks" },
        { original: "observables", simplified: "things we can measure" },
      ]

      for (const term of complexTerms) {
        if (processedParagraph.includes(term.original)) {
          processedParagraph = processedParagraph.replace(new RegExp(term.original, "gi"), term.simplified)
          simplifiedTerms.push(term)
        }
      }
    }

    // Apply chunking strategy
    if (profile.text.chunking.strategy === "sentence_limit") {
      const sentences = processedParagraph.split(". ")
      for (let i = 0; i < sentences.length; i += profile.text.chunking.maxLength) {
        const chunk = sentences.slice(i, i + profile.text.chunking.maxLength).join(". ")
        if (chunk.trim()) {
          transformedChunks.push(chunk + (chunk.endsWith(".") ? "" : "."))
        }
      }
    } else {
      transformedChunks.push(processedParagraph)
    }
  }

  // Add analogies if enabled
  if (profile.simplification.useAnalogies) {
    analogies = [
      "Think of quantum superposition like a coin spinning in the air - it's both heads and tails until it lands.",
      "Quantum entanglement is like having two magical coins that always land on opposite sides, no matter how far apart they are.",
      "The uncertainty principle is like trying to photograph a speeding car - you can see where it is OR how fast it's going, but not both perfectly.",
    ]
  }

  return {
    title: "Quantum Mechanics: Understanding the Basic Nature of Reality",
    chunks: transformedChunks,
    simplifiedTerms: simplifiedTerms.slice(0, 8), // Limit to avoid clutter
    analogies: analogies,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, profile }: TransformRequest = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Transform the content based on the profile
    const transformedContent = transformContent(content.content, profile)

    return NextResponse.json(transformedContent)
  } catch (error) {
    console.error("Content transformation error:", error)
    return NextResponse.json({ error: "Failed to transform content" }, { status: 500 })
  }
}
