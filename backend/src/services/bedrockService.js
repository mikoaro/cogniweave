import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient, BEDROCK_MODELS } from "../config/aws.js";

class BedrockService {
  /**
   * Generate cognitive profile using Claude 3 Opus
   * Preserves exact system prompt from PRD
   */
  async generateCognitiveProfile(onboardingAnswers) {
    const systemPrompt = `You are an expert educational psychologist and accessibility specialist. Your task is to analyze a user's answers to a brief questionnaire and generate a detailed, structured JSON object representing their cognitive profile for the CogniWeave accessibility service. The JSON object must contain specific, actionable parameters that the edge transformation engine can interpret. The parameters should cover text structure, simplification, and visual distraction management. Adhere strictly to the specified JSON schema. Do not add any commentary or explanation outside of the JSON object.

JSON Schema:
{
  "text": {
    "chunking": {
      "strategy": "sentence_limit", // 'sentence_limit' or 'none'
      "maxLength": "integer"
    },
    "vocabulary": {
      "simplificationLevel": "string" // 'none', 'basic', 'intermediate'
    }
  },
  "simplification": {
    "useAnalogies": "boolean",
    "summarization": {
      "defaultState": "string", // 'collapsed' or 'expanded'
      "summaryLength": "percentage" // e.g., 10, 25, 50
    }
  },
  "visuals": {
    "distractionFilter": {
      "enabled": "boolean",
      "sensitivity": "string" // 'low', 'medium', 'high'
    }
  }
}`;

    const userInput = JSON.stringify(onboardingAnswers, null, 2);

    const prompt = `${systemPrompt}\n\nUser Input:\n${userInput}`;

    try {
      const command = new InvokeModelCommand({
        // modelId: BEDROCK_MODELS.CLAUDE_3_OPUS,
        modelId: BEDROCK_MODELS.CLAUDE_3_5_SONNET,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
        //   max_tokens: 1000,
            max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          top_p: 0.9,
        }),
      });

    //   console.log("🧠 Invoking Claude 3 Opus via Bedrock...");
        console.log("🧠 Invoking Claude 3.5 Sonnet v2 via Bedrock...");
      const response = await bedrockClient.send(command);

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const generatedProfile = JSON.parse(responseBody.content[0].text);

      // Add metadata
      generatedProfile.metadata = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // version: "1.0",
        version: "2.0",
        // generatedBy: "claude-3-opus-bedrock",
        generatedBy: "claude-3-5-sonnet-bedrock",
      };

      // Add preferences for the UI
      generatedProfile.preferences = {
      fontSize: 16,
      lineHeight: 1.5,
      colorScheme: "default",
    };

      console.log("✅ Profile generated successfully");
      return generatedProfile;
    } catch (error) {
      console.error("❌ Bedrock API Error:", error);

      // Fallback to intelligent mock response based on answers
      console.log("🔄 Falling back to intelligent mock generation");
      return this.generateMockProfile(onboardingAnswers);
    }
  }

  /**
   * Intelligent fallback that analyzes user responses
   * Maintains the intelligence even without Bedrock access
   */
  generateMockProfile(answers) {
    const profile = {
      text: {
        chunking: {
          strategy: "sentence_limit",
          maxLength: 4,
        },
        vocabulary: {
          simplificationLevel: "intermediate",
        },
      },
      simplification: {
        useAnalogies: false,
        summarization: {
          defaultState: "expanded",
          summaryLength: 25,
        },
      },
      visuals: {
        distractionFilter: {
          enabled: false,
          sensitivity: "medium",
        },
      },
    };

    // Analyze answers for chunking preferences
    if (
      answers.q1_reading_style?.toLowerCase().includes("shorter") ||
      answers.q1_reading_style?.toLowerCase().includes("2-3 sentences")
    ) {
      profile.text.chunking.maxLength = 3;
    }

    // Analyze vocabulary complexity needs
    if (
      answers.q3_complex_topics?.toLowerCase().includes("simple") ||
      answers.q3_complex_topics?.toLowerCase().includes("basic")
    ) {
      profile.text.vocabulary.simplificationLevel = "basic";
    }

    // Analyze analogy preferences
    if (
      answers.q3_complex_topics?.toLowerCase().includes("analog") ||
      answers.q3_complex_topics?.toLowerCase().includes("example")
    ) {
      profile.simplification.useAnalogies = true;
    }

    // Analyze distraction sensitivity
    if (
      answers.q2_distractions?.toLowerCase().includes("very distracted") ||
      answers.q2_distractions?.toLowerCase().includes("completely derail")
    ) {
      profile.visuals.distractionFilter.enabled = true;
      profile.visuals.distractionFilter.sensitivity = "high";
    } else if (answers.q2_distractions?.toLowerCase().includes("distract")) {
      profile.visuals.distractionFilter.enabled = true;
      profile.visuals.distractionFilter.sensitivity = "medium";
    }

    // Add metadata
    profile.metadata = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0",
      generatedBy: "intelligent-mock-fallback",
    };

    profile.preferences = {
      fontSize: 16,
      lineHeight: 1.5,
      colorScheme: "default",
    };

    return profile;
  }
}

export default new BedrockService();
