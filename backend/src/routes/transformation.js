import express from 'express';
import transformationController from '../controllers/transformationController.js';

const router = express.Router();

// Edge transformation simulation endpoints - implements tickets CW-AI-01 through CW-AI-04
router.get('/demo/samples', transformationController.getDemoSamples);
router.post('/text', transformationController.transformText);
router.post('/visuals', transformationController.analyzeVisuals);
router.post('/page', transformationController.transformPage);
router.post('/demo/:sampleName', transformationController.transformSample);

export default router;