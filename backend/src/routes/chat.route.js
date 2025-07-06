import express from 'express';

import { createChat, getChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, createChat);
router.get('/', protectRoute, getChats);
router.post('/group', protectRoute, createGroupChat);
router.put('/rename', protectRoute, renameGroup);
router.put('/groupadd', protectRoute, addToGroup);
router.put('/groupremove', protectRoute, removeFromGroup);


export default router;