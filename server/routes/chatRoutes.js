import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  createOrGetChat,
  getUserChats,
  getChatById,
  sendMessage,
  getChatMessages,
  markChatAsRead
} from '../controllers/chatController.js';

const router = express.Router();

// All chat routes require authentication
router.use(requireAuth);

router.post('/', createOrGetChat);
router.get('/', getUserChats);
router.get('/:chatId', getChatById);
router.post('/:chatId/messages', sendMessage);
router.get('/:chatId/messages', getChatMessages);
router.put('/:chatId/read', markChatAsRead);

export default router;
