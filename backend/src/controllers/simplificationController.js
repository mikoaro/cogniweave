import claudeSimplificationService from "../services/claudeSimplificationService.js";
import dynamoService from "../services/dynamoService.js";
import { sampleContent } from "../utils/sampleData.js";

class SimplificationController {
  /**
   * POST /api/simplify/text
   * Simplify complex text using Claude 3.5 Sonnet
   */
  async simplifyText(req, res) {
    try {
      const userId = req.user.id;
      const { text, profile, options = {} } = req.body;

      console.log(`🔤 Simplifying text for user: ${userId}`);

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          error: {
            message: "Text content required",
            field: "text",
          },
        });
      }

      // Get user profile if not provided
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: {
              message: "No cognitive profile found",
              suggestion:
                "Complete onboarding or provide profile in request body",
            },
          });
        }
        userProfile = storedProfile;
      }

      // Simplify the text using Claude 3.5 Sonnet
      const result = await claudeSimplificationService.simplifyText(
        text,
        userProfile,
        options
      );

      res.json({
        success: true,
        ...result,
        request: {
          userId,
          originalLength: text.length,
          profileUsed: {
            vocabularyLevel: userProfile.text?.vocabulary?.simplificationLevel,
            useAnalogies: userProfile.simplification?.useAnalogies,
            chunkingMaxLength: userProfile.text?.chunking?.maxLength,
          },
          options,
        },
      });
    } catch (error) {
      console.error("❌ Text Simplification Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to simplify text",
          details: error.message,
        },
      });
    }
  }

  /**
   * POST /api/simplify/essay
   * Simplify complete essay while preserving structure
   */
  async simplifyEssay(req, res) {
    try {
      const userId = req.user.id;
      const { essay, profile, options = {} } = req.body;

      console.log(`📝 Simplifying essay for user: ${userId}`);

      if (!essay || essay.trim().length === 0) {
        return res.status(400).json({
          error: {
            message: "Essay content required",
            field: "essay",
          },
        });
      }

      // Get user profile
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: {
              message: "No cognitive profile found",
              suggestion: "Complete onboarding first",
            },
          });
        }
        userProfile = storedProfile;
      }

      // Simplify the essay using Claude 3.5 Sonnet
      const result = await claudeSimplificationService.simplifyEssay(
        essay,
        userProfile,
        options
      );

      console.log("result of transformation");
      console.log(result);

      res.json({
        success: true,
        ...result,
        request: {
          userId,
          originalWordCount: essay.split(/\s+/).length,
          profileUsed: userProfile,
          options,
        },
      });
    } catch (error) {
      console.error("❌ Essay Simplification Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to simplify essay",
          details: error.message,
        },
      });
    }
  }

  /**
   * POST /api/simplify/batch
   * Simplify multiple text segments in batch
   */
  async simplifyBatch(req, res) {
    try {
      const userId = req.user.id;
      const { textSegments, profile, options = {} } = req.body;

      console.log(
        `📚 Batch simplifying ${
          textSegments?.length || 0
        } segments for user: ${userId}`
      );

      if (
        !textSegments ||
        !Array.isArray(textSegments) ||
        textSegments.length === 0
      ) {
        return res.status(400).json({
          error: {
            message: "Text segments array required",
            field: "textSegments",
            example: [
              {
                id: "para1",
                text: "Complex paragraph 1...",
                type: "paragraph",
              },
              {
                id: "para2",
                text: "Complex paragraph 2...",
                type: "paragraph",
              },
            ],
          },
        });
      }

      // Get user profile
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: {
              message: "No cognitive profile found",
              suggestion: "Complete onboarding first",
            },
          });
        }
        userProfile = storedProfile;
      }

      // Process batch simplification
      const result = await claudeSimplificationService.simplifyTextBatch(
        textSegments,
        userProfile,
        options
      );

      res.json({
        success: true,
        ...result,
        request: {
          userId,
          segmentCount: textSegments.length,
          profileUsed: userProfile,
          options,
        },
      });
    } catch (error) {
      console.error("❌ Batch Simplification Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to process batch simplification",
          details: error.message,
        },
      });
    }
  }

  /**
   * GET /api/simplify/demo/samples
   * Get sample complex texts for testing simplification
   */
  async getDemoSamples(req, res) {
    try {
      const complexSamples = {
        academicParagraph: {
          title: "Quantum Mechanics - Academic Text",
          originalText: sampleContent.quantumMechanics.original,
          type: "academic",
          subject: "physics",
          complexity: "high",
          estimatedReadingLevel: "College graduate",
        },

        historyEssay: {
          title: "Renaissance Period - Historical Analysis",
          originalText: sampleContent.historyArticle.original,
          type: "historical",
          subject: "history",
          complexity: "medium-high",
          estimatedReadingLevel: "High school advanced",
        },

        biologyConcept: {
          title: "Photosynthesis - Scientific Explanation",
          originalText: sampleContent.biologyConcept.original,
          type: "scientific",
          subject: "biology",
          complexity: "high",
          estimatedReadingLevel: "College level",
        },

        philosophyEssay: {
          title: "Ethics and Technology - Philosophical Essay",
          originalText: `The epistemological implications of artificial intelligence necessitate a comprehensive re-examination of traditional philosophical paradigms concerning consciousness, intentionality, and moral agency. Contemporary developments in machine learning algorithms, particularly those employing neural network architectures, challenge fundamental assumptions about the nature of cognition and its relationship to ethical responsibility. The phenomenological aspects of human consciousness, as elucidated by philosophers such as Edmund Husserl and Maurice Merleau-Ponty, appear increasingly relevant to discussions about whether artificial systems can possess genuine understanding or merely simulate cognitive processes through sophisticated pattern recognition. This dichotomy between authentic comprehension and algorithmic mimicry raises profound questions about the criteria we employ to attribute moral status to entities, whether biological or artificial.`,
          type: "philosophical",
          subject: "philosophy",
          complexity: "very high",
          estimatedReadingLevel: "Graduate level",
        },

        technicalDocumentation: {
          title: "Cloud Computing Architecture - Technical Guide",
          originalText: `The implementation of microservices architecture within containerized environments necessitates comprehensive orchestration mechanisms to ensure optimal resource allocation and service discovery protocols. Kubernetes clusters facilitate horizontal scaling through declarative configuration management, enabling dynamic load balancing across heterogeneous infrastructure topologies. The integration of service mesh technologies, such as Istio, provides advanced traffic management capabilities including circuit breakers, retry policies, and distributed tracing for enhanced observability. Container registries serve as centralized repositories for immutable image artifacts, supporting continuous integration and deployment pipelines through automated vulnerability scanning and compliance validation processes.`,
          type: "technical",
          subject: "computer science",
          complexity: "very high",
          estimatedReadingLevel: "Professional/Expert",
        },
      };

      res.json({
        success: true,
        message: "Sample complex texts for CogniWeave simplification demo",
        samples: complexSamples,
        usage: {
          textSimplification: {
            endpoint: "POST /api/simplify/text",
            example: {
              text: complexSamples.academicParagraph.originalText,
              options: {
                textType: "academic",
                subject: "physics",
              },
            },
          },
          essaySimplification: {
            endpoint: "POST /api/simplify/essay",
            example: {
              essay: complexSamples.philosophyEssay.originalText,
              options: {
                essayType: "philosophical essay",
                subject: "philosophy and technology",
              },
            },
          },
          batchSimplification: {
            endpoint: "POST /api/simplify/batch",
            example: {
              textSegments: [
                {
                  id: "para1",
                  text: complexSamples.academicParagraph.originalText,
                  type: "academic",
                },
                {
                  id: "para2",
                  text: complexSamples.biologyConcept.originalText,
                  type: "scientific",
                },
              ],
            },
          },
        },
        availableOptions: {
          textType: [
            "academic",
            "scientific",
            "technical",
            "historical",
            "philosophical",
            "general",
          ],
          subject: [
            "physics",
            "biology",
            "chemistry",
            "history",
            "philosophy",
            "computer science",
            "general",
          ],
          essayType: [
            "argumentative essay",
            "analytical essay",
            "research paper",
            "technical documentation",
          ],
          specificInstructions:
            "Custom instructions for the simplification process",
        },
      });
    } catch (error) {
      console.error("❌ Demo Samples Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to retrieve demo samples",
        },
      });
    }
  }

  /**
   * POST /api/simplify/demo/:sampleName
   * Simplify specific sample content using Claude 3.5 Sonnet
   */
  async simplifySample(req, res) {
    try {
      const { sampleName } = req.params;
      const userId = req.user.id;
      const { options = {} } = req.body;

      console.log(`🎯 Simplifying sample "${sampleName}" for user: ${userId}`);

      // Get sample data (this would be expanded with more samples)
      const samples = {
        quantumMechanics: {
          text: sampleContent.quantumMechanics.original,
          options: { textType: "academic", subject: "physics" },
        },
        historyArticle: {
          text: sampleContent.historyArticle.original,
          options: { textType: "historical", subject: "history" },
        },
        biologyConcept: {
          text: sampleContent.biologyConcept.original,
          options: { textType: "scientific", subject: "biology" },
        },
      };

      const sample = samples[sampleName];
      if (!sample) {
        return res.status(404).json({
          error: {
            message: "Sample not found",
            availableSamples: Object.keys(samples),
          },
        });
      }

      // Get user profile
      const userProfile = await dynamoService.getProfile(userId);
      if (!userProfile) {
        return res.status(404).json({
          error: {
            message: "No cognitive profile found",
            suggestion: "Complete onboarding first",
          },
        });
      }

      // Merge sample options with user options
      const mergedOptions = { ...sample.options, ...options };

      // Simplify using Claude 3.5 Sonnet
      const result = await claudeSimplificationService.simplifyText(
        sample.text,
        userProfile,
        mergedOptions
      );

      res.json({
        success: true,
        sampleName,
        ...result,
        comparison: {
          original: {
            text: sample.text,
            wordCount: sample.text.split(/\s+/).length,
            estimatedReadingLevel: "College level",
          },
          simplified: {
            text: result.simplifiedText,
            wordCount: result.simplifiedText?.split(/\s+/).length || 0,
            estimatedReadingLevel: this.estimateReadingLevel(
              userProfile.text?.vocabulary?.simplificationLevel
            ),
          },
        },
        options: mergedOptions,
      });
    } catch (error) {
      console.error("❌ Sample Simplification Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to simplify sample",
          details: error.message,
        },
      });
    }
  }

  /**
   * POST /api/simplify/compare
   * Compare original vs simplified text side by side
   */
  async compareTexts(req, res) {
    try {
      const userId = req.user.id;
      const { text, profile, options = {} } = req.body;

      if (!text) {
        return res.status(400).json({
          error: { message: "Text required for comparison" },
        });
      }

      // Get user profile
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: { message: "No cognitive profile found" },
          });
        }
        userProfile = storedProfile;
      }

      // Simplify the text
      const result = await claudeSimplificationService.simplifyText(
        text,
        userProfile,
        options
      );

      // Generate detailed comparison
      const comparison = this.generateDetailedComparison(
        text,
        result.simplifiedText,
        userProfile
      );

      res.json({
        success: true,
        comparison,
        processingMetadata: result.metadata,
        userId,
      });
    } catch (error) {
      console.error("❌ Text Comparison Error:", error);
      res.status(500).json({
        error: {
          message: "Failed to generate text comparison",
          details: error.message,
        },
      });
    }
  }

  /**
   * Helper method to estimate reading level based on vocabulary setting
   */
  estimateReadingLevel(vocabularyLevel) {
    const levels = {
      basic: "6th-8th grade",
      intermediate: "9th-11th grade",
      advanced: "12th grade+",
      none: "Original level",
    };
    return levels[vocabularyLevel] || "Unknown";
  }

  /**
   * Generate detailed comparison between original and simplified text
   */
  generateDetailedComparison(originalText, simplifiedText, profile) {
    const originalWords = originalText.split(/\s+/);
    const simplifiedWords = simplifiedText.split(/\s+/);
    const originalSentences = originalText
      .split(/[.!?]+/)
      .filter((s) => s.trim());
    const simplifiedSentences = simplifiedText
      .split(/[.!?]+/)
      .filter((s) => s.trim());

    return {
      original: {
        text: originalText,
        wordCount: originalWords.length,
        sentenceCount: originalSentences.length,
        averageWordsPerSentence: Math.round(
          originalWords.length / originalSentences.length
        ),
        estimatedReadingTime: `${Math.ceil(
          originalWords.length / 200
        )} minutes`,
      },
      simplified: {
        text: simplifiedText,
        wordCount: simplifiedWords.length,
        sentenceCount: simplifiedSentences.length,
        averageWordsPerSentence: Math.round(
          simplifiedWords.length / simplifiedSentences.length
        ),
        estimatedReadingTime: `${Math.ceil(
          simplifiedWords.length / 200
        )} minutes`,
      },
      improvements: {
        wordCountReduction: originalWords.length - simplifiedWords.length,
        wordCountReductionPercent: Math.round(
          ((originalWords.length - simplifiedWords.length) /
            originalWords.length) *
            100
        ),
        sentenceCountChange:
          simplifiedSentences.length - originalSentences.length,
        readingTimeImprovement:
          Math.ceil(originalWords.length / 200) -
          Math.ceil(simplifiedWords.length / 200),
        vocabularyLevel:
          profile.text?.vocabulary?.simplificationLevel || "intermediate",
        analogiesUsed: profile.simplification?.useAnalogies || false,
      },
      accessibility: {
        targetReadingLevel: this.estimateReadingLevel(
          profile.text?.vocabulary?.simplificationLevel
        ),
        cognitiveLoadReduction:
          "Reduced complex vocabulary and sentence structure",
        focusImprovements:
          profile.text?.chunking?.strategy === "sentence_limit"
            ? `Paragraphs limited to ${profile.text.chunking.maxLength} sentences`
            : "No chunking applied",
      },
    };
  }
}

export default new SimplificationController();
