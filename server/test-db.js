import prisma from './configs/prisma.js';

async function main() {
  console.log("====================================================");
  console.log("Database Tables Content Summary");
  console.log("====================================================\n");

  try {
    const tables = [
      { name: 'User', model: prisma.user },
      { name: 'Listing', model: prisma.listing },
      { name: 'Chat', model: prisma.chat },
      { name: 'Message', model: prisma.message },
      { name: 'PlatformMessage', model: prisma.platformMessage },
      { name: 'Credential', model: prisma.credential },
      { name: 'Transaction', model: prisma.transaction },
      { name: 'Withdrawal', model: prisma.withdrawal }
    ];

    for (const table of tables) {
      const count = await table.model.count();
      console.log(`- ${table.name} count: ${count}`);
      if (count > 0) {
        const records = await table.model.findMany({ take: 3 });
        console.log(`  Sample records (up to 3):`);
        console.log(JSON.stringify(records, null, 2));
      }
      console.log("----------------------------------------------------");
    }

  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
