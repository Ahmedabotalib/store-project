const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {

  const password = await bcrypt.hash("123456", 10);

  const store = await prisma.store.create({

    data: {

      name: "بدلتك",

      phone: "01000000000",

      isActive: true,

      subscriptionStart: new Date(),

      subscriptionEnd: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ),

      plan: "Yearly",

    },

  });

  await prisma.user.create({

    data: {

      name: "Super Admin",

      email: "admin@test.com",

      password,

      role: "SuperAdmin",

      storeId: store.id,

    },

  });

  console.log("✅ Seed Completed");

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });