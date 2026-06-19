import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

export default router;
