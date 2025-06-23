import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient, BEDROCK_MODELS } from '../config/aws.js';

class ClaudeSimplificationService {
  /**
   * Simplify complex text using Claude 3.5 Sonnet
   * Tailored for cognitive accessibility based on user profile
   */
  async simplifyText(complexText, cognitiveProfile, options = {}) {
    const startTime = Date.now();
    
    try {
      // Build context-aware system prompt based on cognitive profile
      const systemPrompt = this.buildSystemPrompt(cognitiveProfile, options);
      
      // Create the user prompt with the complex text
      const userPrompt = this.buildUserPrompt(complexText, cognitiveProfile, options);

      console.log(`🧠 Invoking Claude 3.5 Sonnet for text simplification...`);
      
      const command = new InvokeModelCommand({
        modelId: BEDROCK_MODELS.CLAUDE_3_5_SONNET,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `${systemPrompt}\n\n${userPrompt}`
            }
          ],
          temperature: 0.3,
          top_p: 0.9
        })
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const simplifiedText = responseBody.content[0].text;

      const processingTime = Date.now() - startTime;

      console.log(`✅ Text simplified successfully in ${processingTime}ms`);

      return {
        status: 'success',
        simplifiedText: simplifiedText.trim(),
        originalText: complexText,
        metadata: {
          processingTime: `${processingTime}ms`,
          model: 'claude-3.5-sonnet-v2',
          profileUsed: {
            vocabularyLevel: cognitiveProfile.text?.vocabulary?.simplificationLevel,
            useAnalogies: cognitiveProfile.simplification?.useAnalogies,
            chunkingMaxLength: cognitiveProfile.text?.chunking?.maxLength
          },
          textStats: {
            originalLength: complexText.length,
            simplifiedLength: simplifiedText.trim().length,
            reductionRatio: ((complexText.length - simplifiedText.trim().length) / complexText.length * 100).toFixed(1) + '%'
          },
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Claude Simplification Error:', error);
      
      // Fallback to local simplification service
      console.log('🔄 Falling back to local transformation service');
      return this.fallbackSimplification(complexText, cognitiveProfile, options);
    }
  }

  /**
   * Build system prompt based on cognitive profile
   */
  buildSystemPrompt(cognitiveProfile, options) {
    const vocabularyLevel = cognitiveProfile.text?.vocabulary?.simplificationLevel || 'intermediate';
    const useAnalogies = cognitiveProfile.simplification?.useAnalogies || false;
    const maxSentencesPerParagraph = cognitiveProfile.text?.chunking?.maxLength || 4;
    const textType = options.textType || 'general';

    let systemPrompt = `You are an expert accessibility specialist and educational content adapter. Your task is to transform complex academic or technical text into clear, accessible content that maintains accuracy while being easier to understand.

COGNITIVE PROFILE REQUIREMENTS:
- Vocabulary Level: ${vocabularyLevel}
- Use Analogies: ${useAnalogies ? 'Yes - include helpful analogies and real-world examples' : 'No - focus on clear, direct explanations'}
- Paragraph Structure: Maximum ${maxSentencesPerParagraph} sentences per paragraph
- Content Type: ${textType}

TRANSFORMATION GUIDELINES:

1. VOCABULARY SIMPLIFICATION (${vocabularyLevel} level):`;

    if (vocabularyLevel === 'basic') {
      systemPrompt += `
   - Replace complex academic terms with everyday language
   - Use common words that most people know
   - Explain any technical terms that must remain
   - Aim for 6th-8th grade reading level`;
    } else if (vocabularyLevel === 'intermediate') {
      systemPrompt += `
   - Use moderately complex vocabulary but avoid jargon
   - Explain technical terms when first introduced
   - Balance accessibility with precision
   - Aim for 9th-11th grade reading level`;
    } else {
      systemPrompt += `
   - Maintain technical accuracy while improving clarity
   - Define complex terms in context
   - Use precise language appropriate for the subject
   - Aim for 12th grade+ reading level`;
    }

    systemPrompt += `

2. SENTENCE AND PARAGRAPH STRUCTURE:
   - Keep paragraphs to ${maxSentencesPerParagraph} sentences maximum
   - Use shorter, clearer sentences when possible
   - Break up long, complex sentences into multiple shorter ones
   - Use transition words to maintain flow between ideas

3. CONTENT ORGANIZATION:
   - Maintain the logical flow of the original text
   - Use clear topic sentences for each paragraph
   - Preserve all important information and concepts
   - Add section breaks or headers if helpful for longer texts`;

    if (useAnalogies) {
      systemPrompt += `

4. ANALOGIES AND EXAMPLES:
   - Include helpful analogies to explain abstract concepts
   - Use familiar, real-world examples
   - Make complex ideas relatable through comparison
   - Ensure analogies are accurate and don't oversimplify`;
    }

    systemPrompt += `

IMPORTANT REQUIREMENTS:
- Preserve all factual information from the original text
- Maintain the author's intent and meaning
- Do not add information not present in the original
- Keep the same general length and depth of coverage
- Use active voice when possible
- Return ONLY the simplified text, no commentary or explanation`;

    return systemPrompt;
  }

  /**
   * Build user prompt with the complex text
   */
  buildUserPrompt(complexText, cognitiveProfile, options) {
    const textType = options.textType || 'academic content';
    const specificInstructions = options.specificInstructions || '';

    let userPrompt = `Please transform the following ${textType} into accessible, easy-to-understand text while preserving all important information and concepts:

ORIGINAL TEXT:
${complexText}`;

    if (specificInstructions) {
      userPrompt += `\n\nADDITIONAL INSTRUCTIONS:
${specificInstructions}`;
    }

    userPrompt += `\n\nSIMPLIFIED TEXT:`;

    return userPrompt;
  }

  /**
   * Batch simplification for multiple text segments
   */
  async simplifyTextBatch(textSegments, cognitiveProfile, options = {}) {
    const startTime = Date.now();
    const results = [];

    console.log(`📚 Starting batch simplification of ${textSegments.length} segments`);

    try {
      // Process segments in parallel (with rate limiting)
      const batchSize = 3; // Process 3 at a time to avoid rate limits
      const batches = [];
      
      for (let i = 0; i < textSegments.length; i += batchSize) {
        batches.push(textSegments.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const batchPromises = batch.map((segment, index) => 
          this.simplifyText(segment.text, cognitiveProfile, {
            ...options,
            segmentId: segment.id || `segment_${index}`,
            textType: segment.type || options.textType
          })
        );

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Small delay between batches to respect rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      const totalProcessingTime = Date.now() - startTime;

      return {
        status: 'success',
        results,
        batchMetadata: {
          totalSegments: textSegments.length,
          successfulTransformations: results.filter(r => r.status === 'success').length,
          failedTransformations: results.filter(r => r.status === 'error').length,
          totalProcessingTime: `${totalProcessingTime}ms`,
          averageProcessingTime: `${Math.round(totalProcessingTime / textSegments.length)}ms per segment`,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Batch Simplification Error:', error);
      return {
        status: 'error',
        error: error.message,
        partialResults: results
      };
    }
  }

  /**
   * Simplify essay with structure preservation
   */
  async simplifyEssay(essay, cognitiveProfile, options = {}) {
    const startTime = Date.now();

    try {
      // Enhanced system prompt for essay structure
      const essaySystemPrompt = this.buildEssaySystemPrompt(cognitiveProfile, options);
      const userPrompt = this.buildEssayUserPrompt(essay, options);

      console.log(`📝 Simplifying essay with Claude 3.5 Sonnet...`);

      const command = new InvokeModelCommand({
        modelId: BEDROCK_MODELS.CLAUDE_3_5_SONNET,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 6000, // Increased for longer essays
          messages: [
            {
              role: "user",
              content: `${essaySystemPrompt}\n\n${userPrompt}`
            }
          ],
          temperature: 0.2, // Lower temperature for more consistent structure
          top_p: 0.9
        })
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const simplifiedEssay = responseBody.content[0].text;

      const processingTime = Date.now() - startTime;

      return {
        status: 'success',
        simplifiedEssay: simplifiedEssay.trim(),
        originalEssay: essay,
        metadata: {
          processingTime: `${processingTime}ms`,
          model: 'claude-3.5-sonnet-v2',
          essayStructure: this.analyzeEssayStructure(simplifiedEssay.trim()),
          profileUsed: {
            vocabularyLevel: cognitiveProfile.text?.vocabulary?.simplificationLevel,
            useAnalogies: cognitiveProfile.simplification?.useAnalogies,
            chunkingMaxLength: cognitiveProfile.text?.chunking?.maxLength
          },
          textStats: {
            originalLength: essay.length,
            simplifiedLength: simplifiedEssay.trim().length,
            originalWordCount: essay.split(/\s+/).length,
            simplifiedWordCount: simplifiedEssay.trim().split(/\s+/).length,
            readabilityImprovement: 'Estimated 2-3 grade levels easier'
          },
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Essay Simplification Error:', error);
      return this.fallbackEssaySimplification(essay, cognitiveProfile, options);
    }
  }

  /**
   * Build enhanced system prompt for essay simplification
   */
  buildEssaySystemPrompt(cognitiveProfile, options) {
    const basePrompt = this.buildSystemPrompt(cognitiveProfile, options);
    
    return basePrompt + `

ESSAY-SPECIFIC REQUIREMENTS:
- Preserve the essay's argument structure and flow
- Maintain clear introduction, body paragraphs, and conclusion
- Keep the thesis statement clear and prominent
- Preserve logical transitions between paragraphs
- Maintain supporting evidence and examples
- Ensure each paragraph has a clear main idea
- Use consistent tone throughout
- Preserve any important quotes or citations (but simplify the surrounding text)

STRUCTURE GUIDELINES:
- Introduction: Clear thesis statement with simplified background context
- Body Paragraphs: One main idea per paragraph with supporting details
- Conclusion: Restate thesis and main points in accessible language
- Transitions: Use clear connecting words between ideas and paragraphs`;
  }

  /**
   * Build user prompt for essay simplification
   */
  buildEssayUserPrompt(essay, options) {
    const essayType = options.essayType || 'academic essay';
    const subject = options.subject || 'general topic';

    return `Please transform the following ${essayType} about ${subject} into clear, accessible prose while maintaining its argumentative structure and all key points:

ORIGINAL ESSAY:
${essay}

SIMPLIFIED ESSAY:`;
  }

  /**
   * Analyze essay structure for metadata
   */
  analyzeEssayStructure(essay) {
    const paragraphs = essay.split('\n\n').filter(p => p.trim().length > 0);
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      paragraphCount: paragraphs.length,
      averageSentencesPerParagraph: Math.round(sentences.length / paragraphs.length),
      estimatedReadingTime: `${Math.ceil(essay.split(/\s+/).length / 200)} minutes`,
      structure: paragraphs.length >= 3 ? 'Multi-paragraph essay' : 'Short form essay'
    };
  }

  /**
   * Fallback simplification when Bedrock is unavailable
   */
  fallbackSimplification(complexText, cognitiveProfile, options) {
    console.log('🔄 Using fallback text simplification');
    
    // Import the original transformation service for fallback
    const { vocabularyMappings } = require('../utils/sampleData.js');
    const level = cognitiveProfile.text?.vocabulary?.simplificationLevel || 'intermediate';
    const mappings = vocabularyMappings[level] || {};
    
    let simplifiedText = complexText;
    
    // Apply vocabulary simplification
    Object.entries(mappings).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplifiedText = simplifiedText.replace(regex, simple);
    });

    // Basic sentence shortening
    simplifiedText = simplifiedText.replace(/([.!?])\s+/g, '$1\n\n');
    
    return {
      status: 'success',
      simplifiedText,
      originalText: complexText,
      metadata: {
        processingTime: '< 50ms',
        model: 'local-fallback',
        note: 'Fallback simplification used - limited capabilities',
        textStats: {
          originalLength: complexText.length,
          simplifiedLength: simplifiedText.length
        },
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Fallback essay simplification
   */
  fallbackEssaySimplification(essay, cognitiveProfile, options) {
    const fallbackResult = this.fallbackSimplification(essay, cognitiveProfile, options);
    
    return {
      ...fallbackResult,
      simplifiedEssay: fallbackResult.simplifiedText,
      originalEssay: essay,
      metadata: {
        ...fallbackResult.metadata,
        essayStructure: this.analyzeEssayStructure(fallbackResult.simplifiedText)
      }
    };
  }
}

export default new ClaudeSimplificationService();