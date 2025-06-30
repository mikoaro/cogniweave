"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/contexts/profile-context";
import { toast } from "sonner";
import { Zap, RotateCcw, Eye, EyeOff, Loader2 } from "lucide-react";

// Define an interface for your object‑chunks:
interface TextChunk {
  id: string;
  content: string;
  type: string;
  order: number;
  wordCount: number;
  sentenceCount: number;
  estimatedReadingTime: number;
}

const originalContent = {
  title: "Quantum Mechanics: Understanding the Fundamental Nature of Reality",
  content: `Quantum mechanics represents one of the most revolutionary and counterintuitive paradigms in modern physics, fundamentally altering our comprehension of reality at the microscopic scale. This sophisticated theoretical framework, which emerged in the early 20th century through the pioneering work of luminaries such as Max Planck, Werner Heisenberg, and Erwin Schrödinger, describes the probabilistic behavior of subatomic particles and energy quanta.

The principle of superposition constitutes a cornerstone of quantum theory, postulating that particles can exist in multiple states simultaneously until observation collapses the wave function into a definitive state. This phenomenon, exemplified by Schrödinger's famous thought experiment involving a cat that is simultaneously alive and dead, challenges our classical intuitions about the deterministic nature of physical reality.

Furthermore, quantum entanglement demonstrates the non-local correlations between particles, where the measurement of one particle instantaneously affects its entangled partner regardless of the spatial separation between them. Einstein famously referred to this phenomenon as "spooky action at a distance," expressing his discomfort with the implications for locality and realism in physical theory.

The mathematical formalism of quantum mechanics employs complex vector spaces, Hilbert spaces, and operator theory to describe quantum states and their evolution. The Schrödinger equation serves as the fundamental equation governing the time evolution of quantum systems, while Heisenberg's uncertainty principle establishes fundamental limits on the simultaneous measurement of complementary observables such as position and momentum.`,
  sidebar:
    "Advertisement: Learn Advanced Physics Online! Click here for premium courses.",
  images: [
    "decorative-quantum-bg.jpg",
    "advertisement-banner.jpg",
    "author-photo.jpg",
  ],
};

export default function DemoPage() {
  const { profile } = useProfile();
  const [isTransformed, setIsTransformed] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedContent, setTransformedContent] = useState<any>(null);

  const handleTransform = async () => {
    if (!profile) {
      toast.error("Please create your cognitive profile first!");
      return;
    }

    setIsTransforming(true);

    console.log("Json to be transformed");
    console.log(
      JSON.stringify({
        content: originalContent,
        profile: profile,
      })
    );

    //     result of transformation
    // {
    //   status: 'success',
    //   simplifiedEssay: 'Quantum Mechanics: How the Tiniest Parts of Our World Work\n' +
    //     '\n' +
    //     'The way very tiny things like atoms and particles behave is strange and surprising. Scientists discovered these unusual patterns in the early 1900s. Important researchers like Max Planck and Werner Heisenberg showed us that the rules for tiny things are very different from the rules we see in our everyday world.\n' +
    //     '\n' +
    //     'One of the weirdest things about quantum mechanics is that tiny particles can be in multiple places or states at the same time. Think of it like having a coin that is both heads AND tails until you look at it. Only when you check to see which side is up does it become just heads or just tails. Scientists use a famous example of a cat that is somehow both alive and dead at the same time to help explain this odd idea.\n' +
    //     '\n' +
    //     'Another strange discovery is called quantum entanglement. Imagine you have two matching pairs of gloves. If you put one glove in New York and its partner in California, when you look at one glove, you instantly know what the other one is like. With quantum particles, this connection is even more mysterious - changing one particle instantly affects its partner, no matter how far apart they are!\n' +
    //     '\n' +
    //     "Scientists use special math to describe how these tiny particles behave. They have an important equation called the Schrödinger equation that helps predict what particles will do. They also discovered that there are limits to what we can know about particles. For example, the more exactly you know where a particle is, the less you can know about how fast it's moving - like trying to take a clear photo of a racing car.\n" +
    //     '\n' +
    //     'This new understanding of tiny things changed how we think about reality. Even though quantum mechanics seems very strange, it helps us make many modern technologies work, from computers to medical equipment. It shows us that the universe is more mysterious and interesting than we once thought.',
    //   originalEssay: 'Quantum Mechanics: Understanding the Fundamental Nature of Reality\n' +
    //     'Quantum mechanics represents one of the most revolutionary and counterintuitive paradigms in modern physics, fundamentally altering our comprehension of reality at the microscopic scale. This sophisticated theoretical framework, which emerged in the early 20th century through the pioneering work of luminaries such as Max Planck, Werner Heisenberg, and Erwin Schrödinger, describes the probabilistic behavior of subatomic particles and energy quanta.\n' +
    //     '\n' +
    //     "The principle of superposition constitutes a cornerstone of quantum theory, postulating that particles can exist in multiple states simultaneously until observation collapses the wave function into a definitive state. This phenomenon, exemplified by Schrödinger's famous thought experiment involving a cat that is simultaneously alive and dead, challenges our classical intuitions about the deterministic nature of physical reality.\n" +
    //     '\n' +
    //     'Furthermore, quantum entanglement demonstrates the non-local correlations between particles, where the measurement of one particle instantaneously affects its entangled partner regardless of the spatial separation between them. Einstein famously referred to this phenomenon as "spooky action at a distance," expressing his discomfort with the implications for locality and realism in physical theory.\n' +
    //     '\n' +
    //     "The mathematical formalism of quantum mechanics employs complex vector spaces, Hilbert spaces, and operator theory to describe quantum states and their evolution. The Schrödinger equation serves as the fundamental equation governing the time evolution of quantum systems, while Heisenberg's uncertainty principle establishes fundamental limits on the simultaneous measurement of complementary observables such as position and momentum.",
    //   metadata: {
    //     processingTime: '10760ms',
    //     model: 'claude-3.5-sonnet-v2',
    //     essayStructure: {
    //       paragraphCount: 6,
    //       averageSentencesPerParagraph: 3,
    //       estimatedReadingTime: '2 minutes',
    //       structure: 'Multi-paragraph essay'
    //     },
    //     profileUsed: {
    //       vocabularyLevel: 'basic',
    //       useAnalogies: true,
    //       chunkingMaxLength: 3
    //     },
    //     textStats: {
    //       originalLength: 1791,
    //       simplifiedLength: 1912,
    //       originalWordCount: 233,
    //       simplifiedWordCount: 333,
    //       readabilityImprovement: 'Estimated 2-3 grade levels easier'
    //     },
    //     timestamp: '2025-06-29T23:20:07.765Z'
    //   }
    // }

    //     [
    //     "Think of quantum superposition like a coin spinning in the air - it's both heads and tails until it lands.",
    //     "Quantum entanglement is like having two magical coins that always land on opposite sides, no matter how far apart they are.",
    //     "The uncertainty principle is like trying to photograph a speeding car - you can see where it is OR how fast it's going, but not both perfectly."
    // ]

    try {
      // Simulate API call to transform content
      const response = await fetch("http://localhost:3071/api/simplify/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "alex-chen-2025",
        },
        body: JSON.stringify({
          text: originalContent.title + "\n" + originalContent.content,
          profile: profile,
        }),
      });

      // const response = await fetch("/api/transform-content", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     content: originalContent,
      //     profile: profile,
      //   }),
      // });

      if (!response.ok) throw new Error("Transformation failed");

      const result = await response.json();
      console.log("result of transformation");
      console.log(result);
      setTransformedContent(result);
      setIsTransformed(true);
      toast.success("Content transformed successfully!");
    } catch (error) {
      toast.error("Failed to transform content. Please try again.");
    } finally {
      setIsTransforming(false);
    }
  };

  const handleReset = () => {
    setIsTransformed(false);
    setTransformedContent(null);
    toast.info("Showing original content");
  };

  const contentToShow =
    isTransformed && transformedContent ? transformedContent : originalContent;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">CogniWeave Demo</h1>
          <p className="text-muted-foreground mb-6">
            See how CogniWeave transforms complex content in real-time to match
            your cognitive profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleTransform}
              disabled={isTransforming || !profile}
              size="lg"
            >
              {isTransforming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  {isTransformed ? "Transform Again" : "Transform Content"}
                </>
              )}
            </Button>

            {isTransformed && (
              <Button variant="outline" onClick={handleReset} size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Show Original
              </Button>
            )}
          </div>

          {!profile && (
            <p className="text-sm text-muted-foreground mt-4">
              <a href="/onboarding" className="text-primary hover:underline">
                Create your cognitive profile
              </a>{" "}
              to see personalized transformations.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {isTransformed
                        ? contentToShow.title.simplified
                        : originalContent.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {isTransformed ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Transformed Content
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Original Content
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-gray dark:prose-invert max-w-none"
                  style={{
                    fontSize: profile?.preferences?.fontSize
                      ? `${profile.preferences.fontSize}px`
                      : "16px",
                    lineHeight: profile?.preferences?.lineHeight || 1.5,
                  }}
                >
                  {isTransformed && transformedContent ? (
                    <div className="space-y-4">
                      {transformedContent.textChunks.map(
                        (chunk: TextChunk, index: number) => (
                          <div
                            key={chunk.id}
                            className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary/30"
                          >
                            <p className="mb-0">{chunk.content}</p>
                          </div>
                        )
                      )}

                      {transformedContent.simplifiedTerms &&
                        transformedContent.simplifiedTerms.length > 0 && (
                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                              Simplified Terms:
                            </h4>
                            <div className="space-y-2">
                              {transformedContent.simplifiedTerms.map(
                                (term: any, index: number) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium text-blue-800 dark:text-blue-200">
                                      {term.original}
                                    </span>
                                    <span className="mx-2">→</span>
                                    <span className="text-blue-700 dark:text-blue-300">
                                      {term.simplified}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {transformedContent.analogies &&
                        transformedContent.analogies.length > 0 && (
                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                              Simple Analogies:
                            </h4>
                            <div className="space-y-2">
                              {transformedContent.analogies.map(
                                (analogy: string, index: number) => (
                                  <p
                                    key={index}
                                    className="text-sm text-green-800 dark:text-green-200 italic"
                                  >
                                    💡 {analogy}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {originalContent.content
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-justify leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Distraction Elements */}
            <Card
              className={`${
                isTransformed && profile?.visuals?.distractionFilter?.enabled
                  ? "opacity-20 pointer-events-none"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-sm">Advertisement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded text-center">
                  <p className="font-bold">Learn Physics Fast!</p>
                  <p className="text-xs">Premium courses available</p>
                  <Button
                    size="sm"
                    className="mt-2 bg-white text-red-500 hover:bg-gray-100"
                  >
                    Click Here!
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                isTransformed && profile?.visuals?.distractionFilter?.enabled
                  ? "opacity-20 pointer-events-none"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="text-sm">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  → Advanced Quantum Computing
                </div>
                <div className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  → String Theory Explained
                </div>
                <div className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  → Introduction to Particle Physics
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
