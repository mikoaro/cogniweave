import { JSDOM } from 'jsdom';
import { vocabularyMappings } from '../utils/sampleData.js';

class TransformationService {
  /**
   * Transform text content based on cognitive profile
   * Implements the core edge transformation logic server-side for demo
   */
  transformText(content, profile) {
    const startTime = Date.now();
    
    try {
      let transformedContent = content;
      const transformationLog = [];

      // Step 1: Vocabulary Simplification
      if (profile.text.vocabulary.simplificationLevel !== 'none') {
        const result = this.simplifyVocabulary(transformedContent, profile.text.vocabulary.simplificationLevel);
        transformedContent = result.content;
        transformationLog.push(...result.replacements);
      }

      // Step 2: Paragraph Chunking
      if (profile.text.chunking.strategy === 'sentence_limit') {
        const result = this.chunkParagraphs(transformedContent, profile.text.chunking.maxLength);
        transformedContent = result.content;
        transformationLog.push(`Chunked ${result.chunksCreated} paragraphs`);
      }

      // Step 3: Add Analogies (if enabled)
      if (profile.simplification.useAnalogies) {
        const result = this.addAnalogies(transformedContent);
        transformedContent = result.content;
        transformationLog.push(...result.analogies);
      }

      const processingTime = Date.now() - startTime;

      return {
        status: 'success',
        transformedContent,
        metadata: {
          originalLength: content.length,
          transformedLength: transformedContent.length,
          processingTime: `${processingTime}ms`,
          transformations: transformationLog,
          profile: {
            chunkingMaxLength: profile.text.chunking.maxLength,
            vocabularyLevel: profile.text.vocabulary.simplificationLevel,
            analogiesEnabled: profile.simplification.useAnalogies
          }
        }
      };

    } catch (error) {
      console.error('❌ Transformation Error:', error);
      return {
        status: 'error',
        error: error.message,
        transformedContent: content // Return original on error
      };
    }
  }

  /**
   * Simplify vocabulary based on profile level
   */
  simplifyVocabulary(content, level) {
    const mappings = vocabularyMappings[level] || {};
    const replacements = [];
    let simplifiedContent = content;

    Object.entries(mappings).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      if (regex.test(simplifiedContent)) {
        simplifiedContent = simplifiedContent.replace(regex, 
          `<span class="simplified-word" data-original="${complex}" title="Original: ${complex}">${simple}</span>`
        );
        replacements.push(`"${complex}" → "${simple}"`);
      }
    });

    return { content: simplifiedContent, replacements };
  }

  /**
   * Chunk long paragraphs into smaller segments
   */
  chunkParagraphs(content, maxSentences) {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    const paragraphs = document.querySelectorAll('p');
    let chunksCreated = 0;

    paragraphs.forEach(p => {
      const text = p.textContent;
      const sentences = this.splitIntoSentences(text);
      
      if (sentences.length > maxSentences) {
        // Create new paragraph elements for chunks
        const chunks = [];
        for (let i = 0; i < sentences.length; i += maxSentences) {
          const chunk = sentences.slice(i, i + maxSentences).join(' ');
          chunks.push(`<p class="chunked-paragraph">${chunk}</p>`);
        }
        
        // Replace original paragraph with chunks
        p.outerHTML = chunks.join('\n');
        chunksCreated++;
      }
    });

    return {
      content: document.body.innerHTML || content,
      chunksCreated
    };
  }

  /**
   * Split text into sentences (simple implementation)
   */
  splitIntoSentences(text) {
    return text.match(/[^\.!?]+[\.!?]+/g)?.map(s => s.trim()) || [text];
  }

  /**
   * Add helpful analogies for complex concepts
   */
  addAnalogies(content) {
    const analogyMap = {
      'quantum mechanics': 'Think of quantum mechanics like a coin that spins in the air - until it lands, it\'s both heads and tails at the same time.',
      'photosynthesis': 'Photosynthesis is like a plant\'s kitchen where sunlight is the energy source to cook sugar from air and water.',
      'Renaissance': 'The Renaissance was like Europe waking up from a long sleep and rediscovering the wisdom of ancient Greece and Rome.',
      'biochemical process': 'A biochemical process is like a recipe that living things follow to make the chemicals they need.',
      'cognitive frameworks': 'Cognitive frameworks are like different colored glasses - each person sees and understands the world through their own unique lens.'
    };

    const analogies = [];
    let enhancedContent = content;

    Object.entries(analogyMap).forEach(([concept, analogy]) => {
      const regex = new RegExp(`\\b${concept}\\b`, 'gi');
      if (regex.test(enhancedContent)) {
        enhancedContent = enhancedContent.replace(regex, 
          `${concept} <span class="analogy-tooltip" title="${analogy}">💡</span>`
        );
        analogies.push(`Added analogy for "${concept}"`);
      }
    });

    return { content: enhancedContent, analogies };
  }

  /**
   * Analyze visual elements for distraction filtering
   * Implements the ANALYZE_VISUALS logic from PRD
   */
  analyzeVisuals(elements, profile) {
    const startTime = Date.now();
    const visualActions = [];
    const { enabled, sensitivity } = profile.visuals.distractionFilter;

    if (!enabled) {
      return {
        status: 'success',
        visualActions: elements.map(el => ({
          id: el.id,
          action: 'keep_visible'
        })),
        metadata: {
          processingTime: `${Date.now() - startTime}ms`,
          filterEnabled: false
        }
      };
    }

    elements.forEach(element => {
      let action = 'keep_visible';

      // Determine action based on semantic context and sensitivity
      switch (element.semantic_context) {
        case 'sidebar_advertisement':
        case 'popup_advertisement':
        case 'newsletter_signup':
          action = sensitivity === 'high' ? 'hide' : 'fade_to_30_percent_opacity';
          break;

        case 'decorative_stock_photo':
          if (sensitivity === 'high') {
            action = 'fade_to_20_percent_opacity';
          } else if (sensitivity === 'medium') {
            action = 'fade_to_50_percent_opacity';
          }
          break;
          
        case 'main_article_figure':
        case 'educational_content':
          action = 'keep_visible'; // Always keep educational content
          break;

        default:
          if (sensitivity === 'high' && element.position === 'sidebar') {
            action = 'fade_to_40_percent_opacity';
          }
      }

      visualActions.push({
        id: element.id,
        action,
        reasoning: this.getActionReasoning(element, action, sensitivity)
      });
    });

    return {
      status: 'success',
      visualActions,
      metadata: {
        processingTime: `${Date.now() - startTime}ms`,
        filterEnabled: true,
        sensitivity,
        elementsProcessed: elements.length,
        actionsHide: visualActions.filter(a => a.action === 'hide').length,
        actionsFade: visualActions.filter(a => a.action.includes('fade')).length,
        actionsKeep: visualActions.filter(a => a.action === 'keep_visible').length
      }
    };
  }

  /**
   * Provide reasoning for visual filtering decisions
   */
  getActionReasoning(element, action, sensitivity) {
    const reasoningMap = {
      'hide': `Hidden due to ${sensitivity} sensitivity to ${element.semantic_context}`,
      'keep_visible': `Kept visible - essential ${element.semantic_context}`,
      'fade_to_20_percent_opacity': `Faded to reduce visual distraction from ${element.semantic_context}`,
      'fade_to_30_percent_opacity': `Moderately faded - ${element.semantic_context} with ${sensitivity} sensitivity`,
      'fade_to_40_percent_opacity': `Lightly faded - ${element.position} content with ${sensitivity} sensitivity`,
      'fade_to_50_percent_opacity': `Reduced opacity - decorative content with ${sensitivity} sensitivity`
    };

    return reasoningMap[action] || `${action} applied to ${element.semantic_context}`;
  }

  /**
   * Transform complete HTML page
   * Combines text and visual transformations
   */
  transformPage(htmlContent, profile) {
    const startTime = Date.now();
    
    try {
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      
      // Extract and transform text content
      const textNodes = this.extractTextContent(document);
      let textTransformations = 0;
      
      textNodes.forEach(node => {
        const originalText = node.textContent;
        const transformed = this.transformText(originalText, profile);
        if (transformed.status === 'success') {
          node.innerHTML = transformed.transformedContent;
          textTransformations++;
        }
      });

      // Extract and analyze visual elements
      const visualElements = this.extractVisualElements(document);
      const visualAnalysis = this.analyzeVisuals(visualElements, profile);
      
      // Apply visual transformations
      if (visualAnalysis.status === 'success') {
        this.applyVisualActions(document, visualAnalysis.visualActions);
      }

      return {
        status: 'success',
        transformedHtml: dom.serialize(),
        metadata: {
          processingTime: `${Date.now() - startTime}ms`,
          textTransformations,
          visualTransformations: visualAnalysis.visualActions?.length || 0,
          profile: {
            chunking: profile.text.chunking,
            vocabulary: profile.text.vocabulary.simplificationLevel,
            analogies: profile.simplification.useAnalogies,
            distractionFilter: profile.visuals.distractionFilter
          }
        }
      };

    } catch (error) {
      console.error('❌ Page Transformation Error:', error);
      return {
        status: 'error',
        error: error.message,
        transformedHtml: htmlContent
      };
    }
  }

  /**
   * Extract text content nodes from DOM
   */
  extractTextContent(document) {
    return Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span'))
      .filter(node => node.textContent.trim().length > 0);
  }

  /**
   * Extract visual elements from DOM for analysis
   */
  extractVisualElements(document) {
    const elements = [];
    
    // Images
    document.querySelectorAll('img').forEach((img, index) => {
      elements.push({
        id: `img-${index}`,
        type: 'image',
        semantic_context: this.classifyImageContext(img),
        position: this.getElementPosition(img),
        size: {
          width: img.width || 0,
          height: img.height || 0
        }
      });
    });

    // Iframes (ads, embeds)
    document.querySelectorAll('iframe').forEach((iframe, index) => {
      elements.push({
        id: `iframe-${index}`,
        type: 'iframe',
        semantic_context: this.classifyIframeContext(iframe),
        position: this.getElementPosition(iframe)
      });
    });

    // Aside elements (sidebars)
    document.querySelectorAll('aside').forEach((aside, index) => {
      elements.push({
        id: `aside-${index}`,
        type: 'aside',
        semantic_context: 'sidebar_content',
        position: 'sidebar'
      });
    });

    return elements;
  }

  /**
   * Classify image context for filtering decisions
   */
  classifyImageContext(img) {
    const src = img.src?.toLowerCase() || '';
    const alt = img.alt?.toLowerCase() || '';
    const className = img.className?.toLowerCase() || '';
    
    if (src.includes('ad') || className.includes('ad')) {
      return 'sidebar_advertisement';
    }
    if (src.includes('stock') || alt.includes('decorative')) {
      return 'decorative_stock_photo';
    }
    if (img.closest('article') || alt.includes('figure')) {
      return 'main_article_figure';
    }
    
    return 'general_image';
  }

  /**
   * Classify iframe context
   */
  classifyIframeContext(iframe) {
    const src = iframe.src?.toLowerCase() || '';
    
    if (src.includes('youtube') || src.includes('vimeo')) {
      return 'educational_content';
    }
    if (src.includes('ads') || src.includes('doubleclick')) {
      return 'sidebar_advertisement';
    }
    
    return 'embedded_content';
  }

  /**
   * Determine element position in layout
   */
  getElementPosition(element) {
    if (element.closest('aside, .sidebar')) return 'sidebar';
    if (element.closest('header')) return 'header';
    if (element.closest('footer')) return 'footer';
    if (element.closest('article, main')) return 'main';
    
    return 'inline';
  }

  /**
   * Apply visual filtering actions to DOM
   */
  applyVisualActions(document, visualActions) {
    visualActions.forEach(({ id, action }) => {
      const element = document.getElementById(id) || 
                    document.querySelector(`[data-element-id="${id}"]`);
      
      if (!element) return;

      switch (action) {
        case 'hide':
          element.style.display = 'none';
          break;
        case 'fade_to_20_percent_opacity':
          element.style.opacity = '0.2';
          break;
        case 'fade_to_30_percent_opacity':
          element.style.opacity = '0.3';
          break;
        case 'fade_to_40_percent_opacity':
          element.style.opacity = '0.4';
          break;
        case 'fade_to_50_percent_opacity':
          element.style.opacity = '0.5';
          break;
        case 'keep_visible':
        default:
          // No changes needed
          break;
      }
    });
  }
}

export default new TransformationService();