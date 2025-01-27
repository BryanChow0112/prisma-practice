import { PrismaClient, Role } from "@prisma/client";

// Instantiate PrismaClient to interact with your database
const prisma = new PrismaClient();

async function main() {
  console.log("--- Prisma Script Started ---");

  console.log("--- Cleaning up database ---");

  // **Clean up data (delete in reverse dependency order)**
  await prisma.post.deleteMany({}); // Delete all posts first
  await prisma.userPreference.deleteMany({}); // Delete all user preferences
  await prisma.user.deleteMany({}); // Delete all users - now should work without FK errors
  await prisma.category.deleteMany({}); // Delete all categories (optional, but good cleanup)

  console.log("--- Database cleanup complete ---");

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

  // **2. READ OPERATIONS (Find Single, Multiple, Unique)**
  console.log("\n--- READ OPERATIONS ---");

  // 2.1. Find a single User by ID (using `findUnique`)
  const foundUserUnique = await prisma.user.findUnique({
    where: { id: newUser.id } // Using the ID from the user created in step 1.1
  });
  console.log("Found User (Unique):", foundUserUnique);

  // 2.2. Find the first User matching a condition (using `findFirst`)
  const firstUserOver40 = await prisma.user.findFirst({
    where: { age: { gt: 40 } } // Find the first user with age greater than 40
  });
  console.log("First User Over 40:", firstUserOver40);

  // 2.3. Find all User records (using `findMany`)
  const allUsers = await prisma.user.findMany();
  console.log("All Users:", allUsers);

  // **3. FILTERING (within Read Operations - `where` clause)**
  console.log("\n--- FILTERING EXAMPLES ---");

  // 3.1. Find Users with names IN a list (using `in`)
  const usersInList = await prisma.user.findMany({
    where: { name: { in: ["Eva Green", "Grace Kelly"] } }
  });
  console.log("Users with names in list:", usersInList);

  // 3.2. Find Users with names NOT IN a list (using `notIn`)
  const usersNotInList = await prisma.user.findMany({
    where: { name: { notIn: ["Eva Green", "Grace Kelly"] } }
  });
  console.log("Users with names NOT in list:", usersNotInList);

  // 3.3. Find Users whose name CONTAINS "e" (case-insensitive contains)
  const usersNameContains = await prisma.user.findMany({
    where: { name: { contains: "e", mode: "insensitive" } } // 'insensitive' for case-insensitive search
  });
  console.log(
    "Users whose name contains 'e' (insensitive):",
    usersNameContains
  );

  // 3.4. Find Users with age greater than 30 AND role BASIC (using `AND`)
  const usersAgeAndRole = await prisma.user.findMany({
    where: {
      AND: [{ age: { gt: 30 } }, { role: Role.BASIC }]
    }
  });
  console.log("Users over 30 AND role BASIC:", usersAgeAndRole);

  // 3.5. Find Users with age less than 30 OR role ADMIN (using `OR`)
  const usersAgeOrRole = await prisma.user.findMany({
    where: {
      OR: [{ age: { lt: 30 } }, { role: Role.ADMIN }]
    }
  });
  console.log("Users under 30 OR role ADMIN:", usersAgeOrRole);

  // 3.6. Find Users whose email DOES NOT contain "example.com" (using `not` and `contains`)
  const usersNotExampleEmail = await prisma.user.findMany({
    where: {
      NOT: {
        email: { contains: "example.com" }
      }
    }
  });
  console.log(
    "Users with email NOT containing 'example.com':",
    usersNotExampleEmail
  );

  // 3.7. Pagination: Take 2 users, skip the first one (using `take`, `skip`)
  const paginatedUsers = await prisma.user.findMany({
    take: 2, // Limit to 2 results
    skip: 1 // Skip the first result
  });
  console.log("Paginated Users (take 2, skip 1):", paginatedUsers);

  console.log("\n--- Prisma Script Completed ---");
}

main()
  .catch((e) => {
    console.error("Error during Prisma operations:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
