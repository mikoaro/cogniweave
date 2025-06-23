import express from 'express';
import simplificationController from '../controllers/simplificationController.js';

const router = express.Router();

// Claude 3.5 Sonnet powered text simplification endpoints
router.get('/demo/samples', simplificationController.getDemoSamples);
router.post('/text', simplificationController.simplifyText);
router.post('/essay', simplificationController.simplifyEssay);
router.post('/batch', simplificationController.simplifyBatch);
router.post('/compare', simplificationController.compareTexts);
router.post('/demo/:sampleName', simplificationController.simplifySample);

export default router;