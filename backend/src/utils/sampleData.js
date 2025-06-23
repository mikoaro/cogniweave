// Sample data preserving PRD examples and adding educational content

export const sampleOnboardingResponses = {
  "alex-chen-adhd-dyslexia": {
    q1_reading_style:
      "I prefer shorter paragraphs, maybe 2-3 sentences max. Long blocks of text make me lose focus quickly.",
    q2_distractions:
      "I get very distracted by ads and images that aren't part of the main article. Sidebar content pulls my attention away.",
    q3_complex_topics:
      "I learn best when complex ideas are explained with simple examples or analogies. Abstract concepts need concrete comparisons.",
    q4_learning_pace:
      "I need to process information at my own speed, sometimes re-reading sections multiple times.",
    q5_visual_preferences:
      "Clean, minimal layouts help me concentrate. Too many colors or fonts are overwhelming.",
  },
  "demo-user-mild-adhd": {
    q1_reading_style:
      "I can handle longer paragraphs but prefer them broken up with headers and bullet points.",
    q2_distractions:
      "Animated ads and pop-ups completely derail my concentration. Static images are usually fine.",
    q3_complex_topics:
      "I like step-by-step breakdowns and real-world examples to understand theoretical concepts.",
    q4_learning_pace:
      "I prefer to skim first, then dive deep into sections that interest me.",
    q5_visual_preferences:
      "I like highlighted key terms and clear section divisions.",
  },
};

export const sampleCognitiveProfiles = {
  "alex-chen-2025": {
    text: {
      chunking: {
        strategy: "sentence_limit",
        maxLength: 3,
      },
      vocabulary: {
        simplificationLevel: "basic",
      },
    },
    simplification: {
      useAnalogies: true,
      summarization: {
        defaultState: "collapsed",
        summaryLength: 15,
      },
    },
    visuals: {
      distractionFilter: {
        enabled: true,
        sensitivity: "high",
      },
    },
    metadata: {
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-15T10:30:00Z",
      version: "1.0",
    },
    preferences: {
      fontSize: 16,
      lineHeight: 1.5,
      colorScheme: "default",
    },
  },
  "demo-user-2025": {
    text: {
      chunking: {
        strategy: "sentence_limit",
        maxLength: 5,
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
        enabled: true,
        sensitivity: "medium",
      },
    },
    metadata: {
      createdAt: "2025-01-10T14:20:00Z",
      updatedAt: "2025-01-18T09:15:00Z",
      version: "1.2",
    },
    preferences: {
      fontSize: 16,
      lineHeight: 1.5,
      colorScheme: "default",
    },
  },
};

// Sample content from PRD - Quantum Mechanics Wikipedia excerpt
export const sampleContent = {
  quantumMechanics: {
    original: `The ubiquitous proliferation of digital media has fundamentally altered pedagogical paradigms, necessitating a re-evaluation of traditional instructional methodologies to accommodate diverse cognitive frameworks. This transformation requires educators to leverage emergent technologies to foster more inclusive and personalized learning ecosystems. Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.`,

    metadata: {
      source: "Educational Content - Physics",
      complexity: "high",
      wordCount: 94,
      sentences: 3,
    },
  },

  historyArticle: {
    original: `The Renaissance period, spanning roughly from the 14th to the 17th century, marked a profound cultural transformation across Europe. This epoch witnessed unprecedented developments in art, science, literature, and philosophy, fundamentally reshaping Western civilization. The term "Renaissance" itself, meaning "rebirth" in French, encapsulates the era's emphasis on renewed interest in classical antiquity and humanistic values. Prominent figures such as Leonardo da Vinci, Michelangelo, and Galileo Galilei epitomized the Renaissance ideal of the "universal genius" or "Renaissance man."`,

    metadata: {
      source: "Educational Content - History",
      complexity: "medium-high",
      wordCount: 89,
      sentences: 4,
    },
  },

  biologyConcept: {
    original: `Photosynthesis is an intricate biochemical process whereby plants, algae, and certain bacteria convert light energy, typically from the sun, into chemical energy stored in glucose molecules. This complex process occurs in two main stages: the light-dependent reactions (photophosphorylation) and the light-independent reactions (Calvin cycle). The overall equation for photosynthesis can be represented as: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.`,

    metadata: {
      source: "Educational Content - Biology",
      complexity: "high",
      wordCount: 67,
      sentences: 3,
    },
  },
};

// Vocabulary simplification mappings - preserved from PRD concept
export const vocabularyMappings = {
  basic: {
    ubiquitous: "everywhere",
    proliferation: "spread",
    pedagogical: "teaching",
    paradigms: "methods",
    necessitating: "requiring",
    methodologies: "ways",
    accommodate: "fit",
    cognitive: "thinking",
    frameworks: "structures",
    leverage: "use",
    emergent: "new",
    ecosystems: "systems",
    fundamental: "basic",
    subatomic: "very tiny",
    unprecedented: "never seen before",
    epoch: "time period",
    encapsulates: "shows",
    antiquity: "ancient times",
    epitomized: "showed perfectly",
    intricate: "complex",
    whereby: "where",
    biochemical: "chemical in living things",
    typically: "usually",
    photophosphorylation: "light-powered chemical process",
  },
  intermediate: {
    ubiquitous: "widespread",
    proliferation: "growth",
    pedagogical: "educational",
    paradigms: "approaches",
    methodologies: "techniques",
    cognitive: "mental",
    leverage: "utilize",
    emergent: "emerging",
    fundamental: "essential",
    unprecedented: "extraordinary",
    encapsulates: "represents",
    epitomized: "represented",
    intricate: "detailed",
    biochemical: "biological chemical",
  },
};

// Sample visual elements for distraction analysis
export const sampleVisualElements = [
  {
    id: "main-article-img1",
    type: "image",
    semantic_context: "main_article_figure",
    position: "inline",
    size: { width: 400, height: 300 },
  },
  {
    id: "sidebar-ad-1",
    type: "advertisement",
    semantic_context: "sidebar_advertisement",
    position: "sidebar",
    size: { width: 300, height: 250 },
  },
  {
    id: "decorative-stock-1",
    type: "image",
    semantic_context: "decorative_stock_photo",
    position: "header",
    size: { width: 800, height: 200 },
  },
  {
    id: "video-embed-1",
    type: "video",
    semantic_context: "educational_content",
    position: "inline",
    size: { width: 560, height: 315 },
  },
  {
    id: "popup-newsletter",
    type: "iframe",
    semantic_context: "newsletter_signup",
    position: "overlay",
  },
];
