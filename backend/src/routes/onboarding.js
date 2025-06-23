import express from 'express';
import onboardingController from '../controllers/onboardingController.js';

const router = express.Router();

// Onboarding endpoints - implements ticket CW-BE-02
router.get('/sample-responses', onboardingController.getSampleResponses);
router.post('/generate', onboardingController.generateProfile);
router.post('/demo/:demoProfile', onboardingController.generateDemoProfile);

export default router;