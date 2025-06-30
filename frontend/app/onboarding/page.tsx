"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/contexts/profile-context";
import { toast } from "sonner";
import { Brain, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface OnboardingData {
  readingStyle: string;
  distractions: string;
  complexTopics: string;
  additionalNeeds: string[];
  learningEnvironment: string;
  timePreference: string;
  focusChallenges: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    readingStyle: "",
    distractions: "",
    complexTopics: "",
    additionalNeeds: [],
    learningEnvironment: "",
    timePreference: "",
    focusChallenges: [],
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    //     {
    //   readingStyle: 'short-paragraphs',
    //   distractions: 'ads-images',
    //   complexTopics: 'analogies',
    //   additionalNeeds: [],
    //   learningEnvironment: 'quiet-minimal',
    //   timePreference: 'short-bursts',
    //   focusChallenges: []
    // }

    try {
      const response = await fetch(
        "http://localhost:3071/api/onboarding/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "alex-chen-2025",
          },
          body: JSON.stringify(data),
        }
      );

      // Mock API call to generate cognitive profile
      // const response = await fetch("/api/profile/generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      if (!response.ok) throw new Error("Failed to generate profile");

      const profile = await response.json();
      console.log("profile");
      console.log(profile);
      setProfile(profile.profile);

      toast.success("Your cognitive profile has been created!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (
    field: "additionalNeeds" | "focusChallenges",
    value: string,
    checked: boolean
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.readingStyle !== "";
      case 2:
        return data.distractions !== "";
      case 3:
        return data.complexTopics !== "";
      case 4:
        return data.learningEnvironment !== "";
      case 5:
        return data.timePreference !== "";
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">
            Create Your Cognitive Profile
          </h1>
          <p className="text-muted-foreground">
            Help us understand how you learn best so we can personalize your web
            experience.
          </p>
        </div>

        <div className="mb-8">
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Reading Preferences"}
              {currentStep === 2 && "Distraction Management"}
              {currentStep === 3 && "Complex Information"}
              {currentStep === 4 && "Learning Environment"}
              {currentStep === 5 && "Time & Focus"}
              {currentStep === 6 && "Additional Support"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 &&
                "How do you prefer to read and process text content?"}
              {currentStep === 2 &&
                "What types of visual elements distract you while reading?"}
              {currentStep === 3 &&
                "How do you best understand complex topics and concepts?"}
              {currentStep === 4 &&
                "What learning environment works best for you?"}
              {currentStep === 5 && "When do you focus best and for how long?"}
              {currentStep === 6 && "Any additional needs or preferences?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  How do you prefer text to be structured?
                </Label>
                <RadioGroup
                  value={data.readingStyle}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, readingStyle: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      // value="short-paragraphs"
                      value="I prefer shorter paragraphs, maybe 2-3 sentences max."
                      id="short-paragraphs"
                    />
                    <Label htmlFor="short-paragraphs">
                      I prefer shorter paragraphs, maybe 2-3 sentences max
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bullet-points" id="bullet-points" />
                    <Label htmlFor="bullet-points">
                      I like information broken into bullet points or lists
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="single-sentences"
                      id="single-sentences"
                    />
                    <Label htmlFor="single-sentences">
                      I focus best with one sentence at a time
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">
                      Standard paragraph length is fine for me
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  What distracts you most while reading online?
                </Label>
                <RadioGroup
                  value={data.distractions}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, distractions: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ads-images" id="ads-images" />
                    <Label htmlFor="ads-images">
                      I get very distracted by ads and images that aren't part
                      of the main content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sidebars" id="sidebars" />
                    <Label htmlFor="sidebars">
                      Sidebars and navigation menus pull my attention away
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="animations" id="animations" />
                    <Label htmlFor="animations">
                      Moving elements and animations break my concentration
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">
                      I'm not easily distracted by visual elements
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  How do you best understand complex information?
                </Label>
                <RadioGroup
                  value={data.complexTopics}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, complexTopics: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analogies" id="analogies" />
                    <Label htmlFor="analogies">
                      I learn best when complex ideas are explained with simple
                      examples or analogies
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="summaries" id="summaries" />
                    <Label htmlFor="summaries">
                      I prefer brief summaries before diving into detailed
                      content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="step-by-step" id="step-by-step" />
                    <Label htmlFor="step-by-step">
                      I need information broken down into clear, sequential
                      steps
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="detailed" />
                    <Label htmlFor="detailed">
                      I prefer comprehensive, detailed explanations
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  What learning environment works best for you?
                </Label>
                <RadioGroup
                  value={data.learningEnvironment}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, learningEnvironment: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quiet-minimal" id="quiet-minimal" />
                    <Label htmlFor="quiet-minimal">
                      Quiet environment with minimal visual stimulation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="background-noise"
                      id="background-noise"
                    />
                    <Label htmlFor="background-noise">
                      I can focus with some background activity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive">
                      I learn better with interactive elements and engagement
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible">
                      I adapt well to different environments
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  When do you focus best and for how long?
                </Label>
                <RadioGroup
                  value={data.timePreference}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, timePreference: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short-bursts" id="short-bursts" />
                    <Label htmlFor="short-bursts">
                      Short bursts (5-15 minutes) with frequent breaks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="medium-sessions"
                      id="medium-sessions"
                    />
                    <Label htmlFor="medium-sessions">
                      Medium sessions (20-45 minutes) work well for me
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long-sessions" id="long-sessions" />
                    <Label htmlFor="long-sessions">
                      I can focus for extended periods (1+ hours)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="varies" id="varies" />
                    <Label htmlFor="varies">
                      It varies depending on the content and my energy
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Do you have any of these additional needs? (Select all that
                    apply)
                  </Label>
                  <div className="space-y-3">
                    {[
                      "Text-to-speech support",
                      "High contrast color schemes",
                      "Larger font sizes",
                      "Reduced motion/animations",
                      "Keyboard navigation",
                      "Screen reader compatibility",
                    ].map((need) => (
                      <div key={need} className="flex items-center space-x-2">
                        <Checkbox
                          id={need}
                          checked={data.additionalNeeds.includes(need)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "additionalNeeds",
                              need,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={need}>{need}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    What focus challenges do you experience? (Select all that
                    apply)
                  </Label>
                  <div className="space-y-3">
                    {[
                      "Difficulty filtering out irrelevant information",
                      "Getting overwhelmed by too much text at once",
                      "Losing track of where I am in long articles",
                      "Difficulty with complex vocabulary",
                      "Trouble maintaining attention on dense content",
                      "Getting distracted by visual elements",
                    ].map((challenge) => (
                      <div
                        key={challenge}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={challenge}
                          checked={data.focusChallenges.includes(challenge)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "focusChallenges",
                              challenge,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={challenge}>{challenge}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Create My Profile"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
