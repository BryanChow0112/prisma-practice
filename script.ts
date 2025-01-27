import { PrismaClient, Role } from "@prisma/client";

// Instantiate PrismaClient to interact with your database
const prisma = new PrismaClient();

async function main() {
  console.log("--- Prisma Script Started ---");

  // **1. CREATE OPERATIONS (Single and Multiple Records)**
  console.log("\n--- CREATE OPERATIONS ---");

  // 1.1. Create a single User record (using `create`)
  const newUser = await prisma.user.create({
    data: {
      name: "Eva Green",
      email: "eva.green@example.com", // Unique email
      age: 32
    }
  });
  console.log("Created User:", newUser);

  // 1.2. Create multiple User records (using `createMany`)
  const manyUsers = await prisma.user.createMany({
    data: [
      { name: "Frank Ocean", email: "frank.ocean@example.com", age: 29 }, // Unique email
      { name: "Grace Kelly", email: "grace.kelly@example.com", age: 45 } // Unique email
    ]
  });
  console.log("Created Many Users:", manyUsers);

  // 1.3. Create a User with nested UserPreference and set Role to ADMIN
  const adminUser = await prisma.user.create({
    data: {
      name: "Henry Ford",
      email: "henry.ford@example.com", // Unique email
      age: 55,
      role: Role.ADMIN, // Setting the enum Role to ADMIN
      userPreference: {
        create: {
          emailUpdates: true // Create related UserPreference record inline
        }
      }
    },
    include: { userPreference: true } // Include the created UserPreference in the result
  });
  console.log("Created Admin User with Preferences:", adminUser);

  
  console.log("\n--- Prisma Script Completed ---");
}

main()
  .catch((e) => {
    console.error("Error during Prisma operations:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
