import prisma from '../configs/prisma.js';
import { inngest } from 'inngest';
export const inngest = new inngest({ id: "marketplace" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event

    const user = await prisma.user.findFirst({
      where: { id: data.id }
    })
    if (user) {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data?.email_addresses[0].email_address,
          name: data.username || `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        }
      })
    }


  }
);













export const functions = []

