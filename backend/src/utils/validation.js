import Joi from 'joi';

// Cognitive Profile Schema - Preserved from PRD
export const cognitiveProfileSchema = Joi.object({
  text: Joi.object({
    chunking: Joi.object({
      strategy: Joi.string().valid('sentence_limit', 'none').required(),
      maxLength: Joi.number().integer().min(1).max(10).when('strategy', {
        is: 'sentence_limit',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
    }).required(),
    vocabulary: Joi.object({
      simplificationLevel: Joi.string().valid('none', 'basic', 'intermediate', 'advanced').required()
    }).required()
  }).required(),
  simplification: Joi.object({
    useAnalogies: Joi.boolean().required(),
    summarization: Joi.object({
      defaultState: Joi.string().valid('collapsed', 'expanded').required(),
      summaryLength: Joi.number().integer().min(5).max(75).required()
    }).required()
  }).required(),
  visuals: Joi.object({
    distractionFilter: Joi.object({
      enabled: Joi.boolean().required(),
      sensitivity: Joi.string().valid('low', 'medium', 'high').required()
    }).required()
  }).required(),
  metadata: Joi.object({
    createdAt: Joi.string().isoDate().optional(),
    updatedAt: Joi.string().isoDate().optional(),
    version: Joi.string().optional()
  }).optional()
});

// Onboarding questionnaire schema
export const onboardingSchema = Joi.object({
  q1_reading_style: Joi.string().min(10).max(500).required(),
  q2_distractions: Joi.string().min(10).max(500).required(),
  q3_complex_topics: Joi.string().min(10).max(500).required(),
  q4_learning_pace: Joi.string().min(10).max(500).optional(),
  q5_visual_preferences: Joi.string().min(10).max(500).optional()
});

// {
//     readingStyle: "",
//     distractions: "",
//     complexTopics: "",
//     additionalNeeds: [],
//     learningEnvironment: "",
//     timePreference: "",
//     focusChallenges: [],
//   }

// Transformation request schemas
export const textTransformSchema = Joi.object({
  content: Joi.string().required(),
  profile: cognitiveProfileSchema.required(),
  options: Joi.object({
    preserveFormatting: Joi.boolean().default(true),
    includeMetadata: Joi.boolean().default(false)
  }).optional()
});

export const visualAnalysisSchema = Joi.object({
  elements: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().valid('image', 'video', 'iframe', 'aside', 'advertisement').required(),
      semantic_context: Joi.string().required(),
      position: Joi.string().valid('header', 'sidebar', 'footer', 'main', 'inline').optional(),
      size: Joi.object({
        width: Joi.number().optional(),
        height: Joi.number().optional()
      }).optional()
    })
  ).required(),
  profile: cognitiveProfileSchema.required()
});