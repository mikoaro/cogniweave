import transformationService from '../services/transformationService.js';
import dynamoService from '../services/dynamoService.js';
import { textTransformSchema, visualAnalysisSchema } from '../utils/validation.js';
import { sampleContent, sampleVisualElements } from '../utils/sampleData.js';

class TransformationController {
  /**
   * POST /api/transform/text
   * Transform text content based on user's cognitive profile
   * Implements the TRANSFORM_TEXT_BLOCK logic from PRD
   */
  async transformText(req, res) {
    try {
      const userId = req.user.id;
      const { content, profile, options = {} } = req.body;

      console.log(`🔄 Transforming text for user: ${userId}`);

      // Validate request
      const { error } = textTransformSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: {
            message: 'Invalid transformation request',
            details: error.details.map(d => ({
              field: d.path.join('.'),
              message: d.message
            }))
          }
        });
      }

      // If no profile provided, fetch user's profile
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: {
              message: 'No cognitive profile found',
              suggestion: 'Complete onboarding or provide profile in request body'
            }
          });
        }
        userProfile = storedProfile;
      }

      // Perform transformation
      const result = transformationService.transformText(content, userProfile);

      res.json({
        success: true,
        ...result,
        request: {
          userId,
          contentLength: content.length,
          profileUsed: {
            chunking: userProfile.text?.chunking,
            vocabulary: userProfile.text?.vocabulary?.simplificationLevel,
            analogies: userProfile.simplification?.useAnalogies
          },
          options
        }
      });

    } catch (error) {
      console.error('❌ Text Transformation Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to transform text',
          details: error.message
        }
      });
    }
  }

  /**
   * POST /api/transform/visuals
   * Analyze visual elements for distraction filtering
   * Implements the ANALYZE_VISUALS logic from PRD
   */
  async analyzeVisuals(req, res) {
    try {
      const userId = req.user.id;
      const { elements, profile } = req.body;

      console.log(`👁️ Analyzing visuals for user: ${userId}`);

      // Validate request
      const { error } = visualAnalysisSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: {
            message: 'Invalid visual analysis request',
            details: error.details.map(d => ({
              field: d.path.join('.'),
              message: d.message
            }))
          }
        });
      }

      // If no profile provided, fetch user's profile
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: {
              message: 'No cognitive profile found',
              suggestion: 'Complete onboarding or provide profile in request body'
            }
          });
        }
        userProfile = storedProfile;
      }

      // Perform visual analysis
      const result = transformationService.analyzeVisuals(elements, userProfile);

      res.json({
        success: true,
        ...result,
        request: {
          userId,
          elementsAnalyzed: elements.length,
          filterSettings: userProfile.visuals?.distractionFilter
        }
      });

    } catch (error) {
      console.error('❌ Visual Analysis Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to analyze visual elements',
          details: error.message
        }
      });
    }
  }

  /**
   * POST /api/transform/page
   * Transform complete HTML page (text + visuals)
   * Combines both transformation engines
   */
  async transformPage(req, res) {
    try {
      const userId = req.user.id;
      const { htmlContent, profile, options = {} } = req.body;

      console.log(`🌐 Transforming page for user: ${userId}`);

      if (!htmlContent) {
        return res.status(400).json({
          error: {
            message: 'HTML content required',
            field: 'htmlContent'
          }
        });
      }

      // Get user profile if not provided
      let userProfile = profile;
      if (!userProfile) {
        const storedProfile = await dynamoService.getProfile(userId);
        if (!storedProfile) {
          return res.status(404).json({
            error: {
              message: 'No cognitive profile found',
              suggestion: 'Complete onboarding first'
            }
          });
        }
        userProfile = storedProfile;
      }

      // Transform the entire page
      const result = transformationService.transformPage(htmlContent, userProfile);

      res.json({
        success: true,
        ...result,
        request: {
          userId,
          originalSize: htmlContent.length,
          profileUsed: {
            textSettings: userProfile.text,
            visualSettings: userProfile.visuals,
            simplificationSettings: userProfile.simplification
          },
          options
        }
      });

    } catch (error) {
      console.error('❌ Page Transformation Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to transform page',
          details: error.message
        }
      });
    }
  }

  /**
   * GET /api/transform/demo/samples
   * Get sample content and visual elements for testing
   */
  async getDemoSamples(req, res) {
    try {
      res.json({
        success: true,
        message: 'Sample content for CogniWeave transformation demo',
        sampleContent: {
          description: 'Use these content samples to test text transformation',
          samples: sampleContent
        },
        sampleVisualElements: {
          description: 'Use these visual elements to test distraction filtering',
          elements: sampleVisualElements
        },
        usage: {
          textTransformation: {
            endpoint: 'POST /api/transform/text',
            example: {
              content: sampleContent.quantumMechanics.original,
              note: 'Profile will be fetched automatically, or provide in request'
            }
          },
          visualAnalysis: {
            endpoint: 'POST /api/transform/visuals',
            example: {
              elements: sampleVisualElements.slice(0, 3),
              note: 'Profile will be fetched automatically, or provide in request'
            }
          },
          pageTransformation: {
            endpoint: 'POST /api/transform/page',
            example: {
              htmlContent: `<html><body><p>${sampleContent.quantumMechanics.original}</p></body></html>`,
              note: 'Combines text and visual transformations'
            }
          }
        }
      });

    } catch (error) {
      console.error('❌ Demo Samples Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to retrieve demo samples'
        }
      });
    }
  }

  /**
   * POST /api/transform/demo/:sampleName
   * Transform specific sample content
   */
  async transformSample(req, res) {
    try {
      const { sampleName } = req.params;
      const userId = req.user.id;

      console.log(`📚 Transforming sample "${sampleName}" for user: ${userId}`);

      // Get sample content
      const sample = sampleContent[sampleName];
      if (!sample) {
        return res.status(404).json({
          error: {
            message: 'Sample not found', 
            availableSamples: Object.keys(sampleContent)
          }
        });
      }

      // Get user profile
      const userProfile = await dynamoService.getProfile(userId);
      if (!userProfile) {
        return res.status(404).json({
          error: {
            message: 'No cognitive profile found',
            suggestion: 'Complete onboarding first'
          }
        });
      }

      // Transform the sample
      const result = transformationService.transformText(sample.original, userProfile);

      res.json({
        success: true,
        sampleName,
        sampleMetadata: sample.metadata,
        ...result,
        comparison: {
          original: {
            content: sample.original,
            length: sample.original.length,
            complexity: sample.metadata.complexity
          },
          transformed: {
            content: result.transformedContent,
            length: result.transformedContent?.length || 0
          }
        }
      });

    } catch (error) {
      console.error(`❌ Sample Transformation Error:`, error);
      res.status(500).json({
        error: {
          message: 'Failed to transform sample',
          details: error.message
        }
      });
    }
  }
}

export default new TransformationController();