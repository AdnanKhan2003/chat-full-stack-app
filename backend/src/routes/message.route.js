import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:chatId', protectRoute, getMessages);
router.post('/', protectRoute, sendMessage);

export default router;