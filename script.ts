import { PrismaClient, Role } from "@prisma/client";

// Instantiate PrismaClient to interact with your database
const prisma = new PrismaClient();

async function main() {
  console.log("--- Prisma Script Started ---");

  console.log("--- Cleaning up database ---");

  // **Clean up data (delete in reverse dependency order)**
  await prisma.post.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

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
      { name: "Bryan Chow", email: "bryan.chow@example.com", age: 23 }, 
      { name: "Frank Ocean", email: "frank.ocean@example.com", age: 29 }, 
      { name: "Grace Kelly", email: "grace.kelly@example.com", age: 45 } 
    ]
  });
  console.log("Created Many Users:", manyUsers);

  // 1.3. Create a User with nested UserPreference and set Role to ADMIN
  const adminUser = await prisma.user.create({
    data: {
      name: "Henry Ford",
      email: "henry.ford@example.com", 
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

  // **4. UPDATE OPERATIONS (Single and Multiple Records, Increment/Decrement)**
  console.log("\n--- UPDATE OPERATIONS ---");

  // 4.1. Update a single User's age (using `update`)
  const updatedUser = await prisma.user.update({
    where: { email: "eva.green@example.com" }, // Target user by unique email
    data: { age: 33 } // Update age to 33
  });
  console.log("Updated User Age:", updatedUser);

  // 4.2. Increment a User's age by 1 (using `increment`)
  const incrementedAgeUser = await prisma.user.update({
    where: { email: "eva.green@example.com" },
    data: {
      age: {
        increment: 1 // Increase age by 1
      }
    }
  });
  console.log("Incremented User Age:", incrementedAgeUser);

  // 4.3. Decrement a User's age by 2 (using `decrement`)
  const decrementedAgeUser = await prisma.user.update({
    where: { email: "eva.green@example.com" },
    data: {
      age: {
        decrement: 2 // Decrease age by 2
      }
    }
  });
  console.log("Decremented User Age:", decrementedAgeUser);

  // 4.4. Update multiple Users' role to BASIC who are older than 50 (using `updateMany`)
  const updatedManyUsers = await prisma.user.updateMany({
    where: { age: { gt: 50 } }, // Target users older than 50
    data: { role: Role.BASIC } // Set their role to BASIC
  });
  console.log("Updated Many Users Role:", updatedManyUsers);

  // **5. CONNECT EXISTING RELATIONSHIPS (Example with Post and User)**
  console.log("\n--- CONNECT RELATIONSHIPS ---");

  // 5.1. Create a Post and connect it to an existing User (author) - using `connect`
  const existingUserForPost = await prisma.user.findFirst({
    where: { name: "Grace Kelly" }
  }); // Find an existing user
  if (!existingUserForPost) {
    console.warn(
      "Grace Kelly user not found, cannot connect Post. Please ensure user 'Grace Kelly' exists."
    );
  } else {
    const newPost = await prisma.post.create({
      data: {
        title: "Connecting Relationships in Prisma",
        averageRating: 4.8,
        author: {
          connect: { id: existingUserForPost.id } // Connect to existing User using their ID
        }
      },
      include: { author: true } // Include author details in the result
    });
    console.log("Created Post with Connected Author:", newPost);
  }

  // **6. DELETE OPERATIONS (Single and Multiple Records)**
  console.log("\n--- DELETE OPERATIONS ---");

  // 6.1. Delete a single User by email (using `delete`)
  const deletedUser = await prisma.user.delete({
    where: { email: "frank.ocean@example.com" } // Target user by unique email
  });
  console.log("Deleted User:", deletedUser);

  // 6.2. Delete multiple Users who are younger than 28 (using `deleteMany` - CAREFUL!)
  // **Caution**: `deleteMany` is powerful and deletes multiple records. Use filters carefully!
  const deletedManyYoungUsers = await prisma.user.deleteMany({
    where: { age: { lt: 28 } } // Target users younger than 28
  });
  console.log(
    "Deleted Many Young Users (CAREFUL with deleteMany):",
    deletedManyYoungUsers
  );

  console.log("\n--- Prisma Script Completed ---");
}

main()
  .catch((e) => {
    console.error("Error during Prisma operations:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
