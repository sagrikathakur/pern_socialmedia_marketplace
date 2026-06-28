import prisma from '../configs/prisma.js';
import { getOrCreateUser } from './listingController.js';

// Create a withdrawal request
export const createWithdrawal = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { amount, account } = req.body;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Please provide a valid withdrawal amount." });
    }

    if (!account || !Array.isArray(account) || account.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide bank account details." });
    }

    // Sync/get user
    const user = await getOrCreateUser(userId);

    const parseAmount = parseFloat(amount);
    const availableBalance = (user.earned || 0) - (user.withdrawn || 0);

    if (parseAmount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Your available balance is $${availableBalance.toFixed(2)}.`
      });
    }

    // Create withdrawal record
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount: parseAmount,
        account,
        isWithdrawn: false
      }
    });

    // Deduct available balance by incrementing the withdrawn field
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        withdrawn: {
          increment: parseAmount
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully!",
      withdrawal,
      balance: {
        earned: updatedUser.earned,
        withdrawn: updatedUser.withdrawn,
        available: updatedUser.earned - updatedUser.withdrawn
      }
    });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all withdrawals (for Admin)
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      withdrawals
    });
  } catch (error) {
    console.error("Error getting withdrawals:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark withdrawal request as processed/withdrawn (for Admin)
export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id }
    });

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: "Withdrawal request not found." });
    }

    if (withdrawal.isWithdrawn) {
      return res.status(400).json({ success: false, message: "Withdrawal request is already processed." });
    }

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id },
      data: {
        isWithdrawn: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Withdrawal request marked as paid/withdrawn.",
      withdrawal: updatedWithdrawal
    });
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
