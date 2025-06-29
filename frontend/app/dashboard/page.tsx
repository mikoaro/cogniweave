"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/profile-context";
import { toast } from "sonner";
import {
  Settings,
  Brain,
  Eye,
  Type,
  Palette,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { profile, updateProfile, isLoading } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/onboarding");
    }
  }, [profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (
    !profile ||
    !profile.text ||
    !profile.text.chunking ||
    !profile.simplification ||
    !profile.visuals ||
    !profile.preferences
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">
            Profile data is incomplete. Please recreate your profile.
          </p>
          <Button onClick={() => router.push("/onboarding")}>
            Go to Onboarding
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Cognitive Profile Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Fine-tune your personalized web experience settings.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Text Processing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Text Processing
              </CardTitle>
              <CardDescription>
                Control how text content is structured and simplified for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Paragraph Chunking
                </Label>
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={
                      profile.text?.chunking?.strategy === "sentence_limit"
                    }
                    onCheckedChange={(checked) =>
                      updateProfile({
                        text: {
                          ...profile.text,
                          chunking: {
                            ...profile.text.chunking,
                            strategy: checked ? "sentence_limit" : "none",
                          },
                        },
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Break long paragraphs into smaller chunks
                  </span>
                </div>
              </div>

              {profile.text?.chunking?.strategy === "sentence_limit" && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Maximum Sentences per Chunk:{" "}
                    {profile.text.chunking.maxLength}
                  </Label>
                  <Slider
                    value={[profile.text.chunking.maxLength]}
                    onValueChange={([value]) =>
                      updateProfile({
                        text: {
                          ...profile.text,
                          chunking: {
                            ...profile.text.chunking,
                            maxLength: value,
                          },
                        },
                      })
                    }
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 sentence</span>
                    <span>10 sentences</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Vocabulary Simplification
                </Label>
                <Select
                  value={
                    profile.text?.vocabulary?.simplificationLevel || "none"
                  }
                  onValueChange={(
                    value: "none" | "basic" | "intermediate" | "advanced"
                  ) =>
                    updateProfile({
                      text: {
                        ...profile.text,
                        vocabulary: {
                          simplificationLevel: value,
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No simplification</SelectItem>
                    <SelectItem value="basic">
                      Basic (replace very complex words)
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate (moderate simplification)
                    </SelectItem>
                    <SelectItem value="advanced">
                      Advanced (maximum simplification)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Simplification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Content Simplification
              </CardTitle>
              <CardDescription>
                Configure how complex information is presented to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Use Analogies for Complex Concepts
                </Label>
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={profile.simplification?.useAnalogies || false}
                    onCheckedChange={(checked) =>
                      updateProfile({
                        simplification: {
                          ...profile.simplification,
                          useAnalogies: checked,
                        },
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Explain difficult concepts with simple analogies
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Summary Default State
                </Label>
                <Select
                  value={
                    profile.simplification?.summarization?.defaultState ||
                    "expanded"
                  }
                  onValueChange={(value: "collapsed" | "expanded") =>
                    updateProfile({
                      simplification: {
                        ...profile.simplification,
                        summarization: {
                          ...profile.simplification.summarization,
                          defaultState: value,
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collapsed">
                      Show summaries first (collapsed)
                    </SelectItem>
                    <SelectItem value="expanded">
                      Show full content (expanded)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Summary Length:{" "}
                  {profile.simplification?.summarization?.summaryLength || 100}%
                </Label>
                <Slider
                  value={[
                    profile.simplification?.summarization?.summaryLength || 100,
                  ]}
                  onValueChange={([value]) =>
                    updateProfile({
                      simplification: {
                        ...profile.simplification,
                        summarization: {
                          ...profile.simplification.summarization,
                          summaryLength: value,
                        },
                      },
                    })
                  }
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very brief (10%)</span>
                  <span>Full content (100%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Visual & Distraction Management
              </CardTitle>
              <CardDescription>
                Control visual elements and reduce distractions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Distraction Filter
                </Label>
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={
                      profile.visuals?.distractionFilter?.enabled || false
                    }
                    onCheckedChange={(checked) =>
                      updateProfile({
                        visuals: {
                          distractionFilter: {
                            ...profile.visuals.distractionFilter,
                            enabled: checked,
                          },
                        },
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Hide or fade non-essential visual elements
                  </span>
                </div>
              </div>

              {profile.visuals?.distractionFilter?.enabled && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Filter Sensitivity
                  </Label>
                  <Select
                    value={
                      profile.visuals?.distractionFilter?.sensitivity ||
                      "medium"
                    }
                    onValueChange={(value: "low" | "medium" | "high") =>
                      updateProfile({
                        visuals: {
                          distractionFilter: {
                            ...profile.visuals.distractionFilter,
                            sensitivity: value,
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Low (minimal filtering)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (balanced filtering)
                      </SelectItem>
                      <SelectItem value="high">
                        High (aggressive filtering)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Display Preferences
              </CardTitle>
              <CardDescription>
                Customize the visual appearance of transformed content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Font Size: {profile.preferences?.fontSize || 16}px
                </Label>
                <Slider
                  value={[profile.preferences?.fontSize || 16]}
                  onValueChange={([value]) =>
                    updateProfile({
                      preferences: {
                        ...profile.preferences,
                        fontSize: value,
                      },
                    })
                  }
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>12px</span>
                  <span>24px</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Line Height: {profile.preferences?.lineHeight || 1.5}
                </Label>
                <Slider
                  value={[profile.preferences?.lineHeight || 1.5]}
                  onValueChange={([value]) =>
                    updateProfile({
                      preferences: {
                        ...profile.preferences,
                        lineHeight: value,
                      },
                    })
                  }
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1.2</span>
                  <span>2.0</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Color Scheme</Label>
                <Select
                  value={profile.preferences?.colorScheme || "default"}
                  onValueChange={(
                    value: "default" | "high-contrast" | "warm"
                  ) =>
                    updateProfile({
                      preferences: {
                        ...profile.preferences,
                        colorScheme: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                    <SelectItem value="warm">
                      Warm (reduced blue light)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
