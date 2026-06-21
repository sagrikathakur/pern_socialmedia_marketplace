import prisma from '../configs/prisma.js';
import { Inngest } from 'inngest';

// Initialize Inngest client
export const inngest = new Inngest({ id: "marketplace" });

// Sync user creation from Clerk
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { data } = event;

    const user = await prisma.user.findFirst({
      where: { id: data.id }
    });

    if (user) {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data?.email_addresses[0].email_address,
          name: (data?.first_name || "") + " " + (data?.last_name || ""),
          image: data?.image_url,
        }
      });
      return;
    }

    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0].email_address,
        name: (data?.first_name || "") + " " + (data?.last_name || ""),
        image: data?.image_url,
      }
    });
  }
);

// Sync user deletion from Clerk
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { data } = event;
    const listings = await prisma.listing.findMany({
      where: { ownerId: data.id }
    });
    const chats = await prisma.chat.findMany({
      where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] }
    });
    const transactions = await prisma.transaction.findMany({
      where: { OR: [{ userId: data.id }, { ownerId: data.id }] }
    });
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: data.id }
    });

    if (listings.length === 0 && chats.length === 0 && transactions.length === 0 && withdrawals.length === 0) {
      try {
        await prisma.user.deleteMany({
          where: { id: data.id }
        });
      } catch (error) {
        console.error(`Failed to delete user ${data.id}:`, error);
        // Fallback: update listings to inactive
        await prisma.listing.updateMany({
          where: { ownerId: data.id },
          data: { status: 'inactive' }
        });
      }
    } else {
      await prisma.listing.updateMany({
        where: { ownerId: data.id },
        data: { status: 'inactive' }
      });
    }
  }
);

// Sync user update from Clerk
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { data } = event;
    const user = await prisma.user.findFirst({
      where: { id: data.id }
    });

    if (!user) {
      await prisma.user.create({
        data: {
          id: data.id,
          email: data?.email_addresses[0].email_address,
          name: (data?.first_name || "") + " " + (data?.last_name || ""),
          image: data?.image_url,
        }
      });
      return;
    }

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses[0].email_address,
        name: (data?.first_name || "") + " " + (data?.last_name || ""),
        image: data?.image_url,
      }
    });
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate
];
