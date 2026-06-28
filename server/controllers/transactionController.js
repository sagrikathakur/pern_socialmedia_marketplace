import prisma from '../configs/prisma.js';
import { getOrCreateUser } from './listingController.js';

// Purchase a listing (create Transaction)
export const purchaseListing = async (req, res) => {
  try {
    const buyerId = req.auth.userId;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ success: false, message: "listingId is required" });
    }

    // Get listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true }
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({ success: false, message: "Listing is no longer active or is already sold" });
    }

    if (listing.ownerId === buyerId) {
      return res.status(400).json({ success: false, message: "You cannot purchase your own listing" });
    }

    // Get/sync buyer user
    await getOrCreateUser(buyerId);

    // Update listing status to sold
    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'sold' }
    });

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        ownerId: listing.ownerId,
        userId: buyerId,
        amount: listing.price,
        isPaid: true
      },
      include: {
        listing: true
      }
    });

    // Update seller's earned balance
    await prisma.user.update({
      where: { id: listing.ownerId },
      data: {
        earned: {
          increment: listing.price
        }
      }
    });

    // Find or create chat between buyer and seller for this listing
    let chat = await prisma.chat.findUnique({
      where: {
        chatUserId_ownerUserId_listingId: {
          chatUserId: buyerId,
          ownerUserId: listing.ownerId,
          listingId
        }
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          chatUserId: buyerId,
          ownerUserId: listing.ownerId,
          listingId,
          lastMessage: "System: Purchase completed! Seller, please submit your account credentials.",
          isLastMessageRead: false,
          lastMessageSenderId: "platform"
        }
      });
    }

    // Create Platform Message in chat
    await prisma.platformMessage.create({
      data: {
        chatId: chat.id,
        message: "System: Purchase completed! The buyer has paid. Seller, please submit your account credentials for verification."
      }
    });

    res.status(201).json({
      success: true,
      message: "Purchase completed successfully!",
      transaction
    });
  } catch (error) {
    console.error("Error purchasing listing:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all transactions (for Admin)
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch user details manually
    const userIds = [...new Set(transactions.map(t => t.userId))];
    const buyers = await prisma.user.findMany({
      where: { id: { in: userIds } }
    });

    const buyerMap = buyers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const enrichedTransactions = transactions.map(t => ({
      ...t,
      buyer: buyerMap[t.userId] || { name: 'Unknown User', email: '' }
    }));

    res.status(200).json({
      success: true,
      transactions: enrichedTransactions
    });
  } catch (error) {
    console.error("Error getting all transactions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get authenticated user's purchases
export const getUserPurchases = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId
      },
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // For each transaction, also retrieve credentials if listing.isCredentialChanged is true
    const enrichedTransactions = await Promise.all(transactions.map(async (t) => {
      let credential = null;
      if (t.listing.isCredentialChanged) {
        credential = await prisma.credential.findFirst({
          where: { listingId: t.listingId }
        });
      }
      return {
        ...t,
        credential
      };
    }));

    res.status(200).json({
      success: true,
      transactions: enrichedTransactions
    });
  } catch (error) {
    console.error("Error getting user purchases:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
