import express from 'express';
import profileController from '../controllers/profileController.js';

const router = express.Router();

// Profile CRUD endpoints - implements ticket CW-BE-01
router.get('/demo/samples', profileController.getSampleProfiles);
router.get('/:userId?', profileController.getProfile);
router.post('/', profileController.createProfile);
router.put('/:userId?', profileController.updateProfile);

export default router;