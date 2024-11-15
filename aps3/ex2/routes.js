// routes.js
import express from 'express';
import TranslationController from './translationController.js';

const router = express.Router();

router.post('/translate', TranslationController.translate);
router.get('/translation/:id', TranslationController.getById);
router.get('/translations', TranslationController.getAll);

export default router;