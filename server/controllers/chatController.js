import prisma from '../configs/prisma.js';

// Create or retrieve a chat for a listing
export const createOrGetChat = async (req, res) => {
  try {
    const chatUserId = req.auth.userId;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ success: false, message: "listingId is required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true }
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const ownerUserId = listing.ownerId;

    // Prevent user from starting a chat with themselves
    if (chatUserId === ownerUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a chat with yourself."
      });
    }

    // Find or create chat
    let chat = await prisma.chat.findUnique({
      where: {
        chatUserId_ownerUserId_listingId: {
          chatUserId,
          ownerUserId,
          listingId
        }
      },
      include: {
        listing: true,
        ownerUser: {
          select: { id: true, name: true, image: true }
        },
        chatUser: {
          select: { id: true, name: true, image: true }
        }
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          chatUserId,
          ownerUserId,
          listingId
        },
        include: {
          listing: true,
          ownerUser: {
            select: { id: true, name: true, image: true }
          },
          chatUser: {
            select: { id: true, name: true, image: true }
          }
        }
      });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all chats for the logged in user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { chatUserId: userId },
          { ownerUserId: userId }
        ],
        active: true
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            platform: true,
            price: true,
            images: true,
            status: true
          }
        },
        ownerUser: {
          select: { id: true, name: true, image: true }
        },
        chatUser: {
          select: { id: true, name: true, image: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single chat with authorization check
export const getChatById = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        listing: true,
        ownerUser: {
          select: { id: true, name: true, image: true }
        },
        chatUser: {
          select: { id: true, name: true, image: true }
        }
      }
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Verify user is part of the chat
    if (chat.chatUserId !== userId && chat.ownerUserId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden: You are not authorized to view this chat." });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a new message in a chat
export const sendMessage = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message content cannot be empty" });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Verify participant
    if (chat.chatUserId !== userId && chat.ownerUserId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot send messages in this chat." });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        chatId,
        sender_id: userId,
        message: message.trim()
      }
    });

    // Update last message metadata on the Chat model
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: message.trim(),
        isLastMessageRead: false,
        lastMessageSenderId: userId
      }
    });

    res.status(201).json({ success: true, message: newMessage, chat: updatedChat });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages for a specific chat
export const getChatMessages = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Verify participant
    if (chat.chatUserId !== userId && chat.ownerUserId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot view messages in this chat." });
    }

    const messages = await prisma.message.findMany({
      where: { chatId }
    });

    const platformMessages = await prisma.platformMessage.findMany({
      where: { chatId }
    });

    const allMessages = [...messages, ...platformMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json({ success: true, messages: allMessages });
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark a chat as read
export const markChatAsRead = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Verify participant
    if (chat.chatUserId !== userId && chat.ownerUserId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot modify this chat." });
    }

    // Mark as read only if the last message was sent by someone else
    let updatedChat = chat;
    if (chat.lastMessageSenderId !== userId && !chat.isLastMessageRead) {
      updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: { isLastMessageRead: true }
      });
    }

    res.status(200).json({ success: true, chat: updatedChat });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
