import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // You will write your Prisma Client queries here
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
