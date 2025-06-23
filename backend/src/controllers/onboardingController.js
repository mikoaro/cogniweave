import bedrockService from "../services/bedrockService.js";
import dynamoService from "../services/dynamoService.js";
import { onboardingSchema } from "../utils/validation.js";
import { sampleOnboardingResponses } from "../utils/sampleData.js";

class OnboardingController {
  /**
   * POST /api/onboarding/generate
   * Generate cognitive profile from onboarding questionnaire
   * Implements ticket CW-BE-02
   */
  async generateProfile(req, res) {
    try {
      const userId = req.user.id;
      const onboardingAnswers = req.body;

      console.log(`🧠 Generating profile for user: ${userId}`);
      console.log(
        `🧠 Generating profile for onboardingAnswers: ${JSON.stringify(
          onboardingAnswers
        )}`
      );

      //   return;

      // Validate onboarding answers
      //   const { error, value } = onboardingSchema.validate(onboardingAnswers);
      //   if (error) {
      //     return res.status(400).json({
      //       error: {
      //         message: "Invalid onboarding data",
      //         details: error.details.map((d) => ({
      //           field: d.path.join("."),
      //           message: d.message,
      //         })),
      //       },
      //     });
      //   }

      //   console.log(`🧠 Generating profile for value: ${JSON.stringify(value)}`);

      //   return;

      // Generate cognitive profile using Bedrock (or intelligent fallback)
      const generatedProfile = await bedrockService.generateCognitiveProfile(
        // value
        onboardingAnswers
      );

      // Save the generated profile to DynamoDB
      const savedProfile = await dynamoService.createProfile(
        userId,
        generatedProfile
      );

      res.status(201).json({
        success: true,
        message: "Cognitive profile generated successfully",
        profile: savedProfile,
        onboarding: {
          questionsAnswered: Object.keys(onboardingAnswers).length,
          //   questionsAnswered: Object.keys(value).length,
          generationMethod: generatedProfile.metadata?.generatedBy || "bedrock",
          processingTime: "< 2 seconds",
        },
        metadata: {
          generated: new Date().toISOString(),
          userId,
          version: generatedProfile.metadata?.version || "1.0",
        },
      });
    } catch (error) {
      console.error("❌ Profile Generation Error:", error);

      // Handle specific error cases
      if (error.message?.includes("already exists")) {
        return res.status(409).json({
          error: {
            message: "Profile already exists for this user",
            suggestion: "Use the profile update endpoint to modify settings",
            existingProfile: await dynamoService.getProfile(req.user.id),
          },
        });
      }

      res.status(500).json({
        error: {
          message: "Failed to generate cognitive profile",
          details: error.message,
          suggestion: "Please try again or contact support",
        },
      });
    }
  }

  /**
   * GET /api/onboarding/sample-responses
   * Get sample onboarding responses for demo purposes
   */
  async getSampleResponses(req, res) {
    try {
      res.json({
        success: true,
        message: "Sample onboarding responses for CogniWeave demo",
        sampleResponses: sampleOnboardingResponses,
        usage: {
          description: "Use these sample responses to test profile generation",
          endpoint: "POST /api/onboarding/generate",
          example:
            "Send any of these response objects to generate a realistic cognitive profile",
        },
        questionnaire: {
          q1_reading_style:
            "How do you prefer to read text content? Describe your ideal paragraph length and structure.",
          q2_distractions:
            "What types of visual elements distract you when trying to focus on reading?",
          q3_complex_topics:
            "How do you best understand complex or technical topics? Do you prefer examples, analogies, or step-by-step explanations?",
          q4_learning_pace:
            "Describe your preferred pace for processing information.",
          q5_visual_preferences:
            "What visual design choices help you focus and learn effectively?",
        },
      });
    } catch (error) {
      console.error("❌ Sample Responses Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to retrieve sample responses",
        },
      });
    }
  }

  /**
   * POST /api/onboarding/demo/:demoProfile
   * Generate profile using predefined demo responses
   */
  async generateDemoProfile(req, res) {
    try {
      const { demoProfile } = req.params;
      const userId = req.user.id;

      console.log(
        `🎭 Generating demo profile: ${demoProfile} for user: ${userId}`
      );

      // Get sample responses
      const demoResponses = sampleOnboardingResponses[demoProfile];
      if (!demoResponses) {
        return res.status(404).json({
          error: {
            message: "Demo profile not found",
            availableProfiles: Object.keys(sampleOnboardingResponses),
          },
        });
      }

      // Generate profile using demo responses
      const generatedProfile = await bedrockService.generateCognitiveProfile(
        demoResponses
      );

      // Save to database
      const savedProfile = await dynamoService.createProfile(
        userId,
        generatedProfile
      );

      res.status(201).json({
        success: true,
        message: `Demo profile "${demoProfile}" generated successfully`,
        profile: savedProfile,
        demoInfo: {
          profileType: demoProfile,
          sampleResponses: demoResponses,
          generationMethod:
            generatedProfile.metadata?.generatedBy || "intelligent-mock",
        },
        metadata: {
          generated: new Date().toISOString(),
          userId,
          isDemoProfile: true,
        },
      });
    } catch (error) {
      console.error("❌ Demo Profile Generation Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to generate demo profile",
          details: error.message,
        },
      });
    }
  }
}

export default new OnboardingController();
