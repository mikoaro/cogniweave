import dynamoService from '../services/dynamoService.js';
import { cognitiveProfileSchema } from '../utils/validation.js';

class ProfileController {
  /**
   * GET /api/profile/:userId
   * Retrieve user's cognitive profile
   */
  async getProfile(req, res) {
    try {
      const { userId } = req.params;
      
      // Use authenticated user ID or URL parameter
      const targetUserId = userId || req.user.id;

      console.log(`📖 Getting profile for user: ${targetUserId}`);
      
      const profile = await dynamoService.getProfile(targetUserId);
      
      if (!profile) {
        return res.status(404).json({
          error: {
            message: 'Profile not found',
            userId: targetUserId,
            suggestion: 'Complete onboarding to create a profile'
          }
        });
      }

      res.json({
        success: true,
        profile,
        metadata: {
          retrieved: new Date().toISOString(),
          userId: targetUserId
        }
      });

    } catch (error) {
      console.error('❌ Get Profile Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to retrieve profile',
          details: error.message
        }
      });
    }
  }

  /**
   * POST /api/profile
   * Create new cognitive profile
   */
  async createProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      console.log(`➕ Creating profile for user: ${userId}`);

      // Validate profile data
      const { error, value } = cognitiveProfileSchema.validate(profileData);
      if (error) {
        return res.status(400).json({
          error: {
            message: 'Invalid profile data',
            details: error.details.map(d => ({
              field: d.path.join('.'),
              message: d.message
            }))
          }
        });
      }

      const profile = await dynamoService.createProfile(userId, value);

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        profile,
        metadata: {
          created: new Date().toISOString(),
          userId
        }
      });

    } catch (error) {
      console.error('❌ Create Profile Error:', error);
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          error: {
            message: 'Profile already exists for this user',
            suggestion: 'Use PUT to update existing profile'
          }
        });
      }

      res.status(500).json({
        error: {
          message: 'Failed to create profile',
          details: error.message
        }
      });
    }
  }

  /**
   * PUT /api/profile/:userId
   * Update existing cognitive profile
   */
  async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      const profileUpdates = req.body;
      
      // Use authenticated user ID or URL parameter
      const targetUserId = userId || req.user.id;

      console.log(`🔄 Updating profile for user: ${targetUserId}`);

      // Validate profile updates
      const { error, value } = cognitiveProfileSchema.validate(profileUpdates);
      if (error) {
        return res.status(400).json({
          error: {
            message: 'Invalid profile data',
            details: error.details.map(d => ({
              field: d.path.join('.'),
              message: d.message
            }))
          }
        });
      }

      const updatedProfile = await dynamoService.updateProfile(targetUserId, value);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        profile: updatedProfile,
        metadata: {
          updated: new Date().toISOString(),
          userId: targetUserId
        }
      });

    } catch (error) {
      console.error('❌ Update Profile Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to update profile',
          details: error.message
        }
      });
    }
  }

  /**
   * GET /api/profile/demo/samples
   * Return sample profiles for demo purposes
   */
  async getSampleProfiles(req, res) {
    try {
      const sampleProfiles = {
        'alex-chen-2025': await dynamoService.getMockProfile('alex-chen-2025'),
        'demo-user-2025': await dynamoService.getMockProfile('demo-user-2025'),
        'test-student-2025': await dynamoService.getMockProfile('test-student-2025')
      };

      res.json({
        success: true,
        message: 'Sample profiles for CogniWeave demo',
        profiles: sampleProfiles,
        usage: 'Use these userIds in API calls for demonstration'
      });

    } catch (error) {
      console.error('❌ Sample Profiles Error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to generate sample profiles'
        }
      });
    }
  }
}

export default new ProfileController();