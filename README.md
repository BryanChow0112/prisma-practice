# My Personal Dive into Prisma

This repository documents **my learning experience with Prisma, a modern ORM (Object-Relational Mapper) for Node.js and TypeScript.**  Prisma acts as a type-safe database client and query builder, simplifying database access and making it more intuitive. I wanted to get hands-on and truly understand how Prisma streamlines database interactions, so I created this to experiment with its core functionalities.


## Badges

![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)


## My Prisma Learning Examples

In this repo, you'll find a TypeScript script that demonstrates various Prisma functionalities.  These are the areas I focused on to build my understanding:

*   **Core CRUD Operations:** I started with the fundamental operations of Create, Read, Update, and Delete (CRUD). I wanted to see how Prisma handles these basic database interactions, so I created examples for:
    *   Creating single and multiple records using `create` and `createMany`.
    *   Reading data using `findUnique`, `findFirst`, and `findMany` to fetch single records, the first matching record, and multiple records.
    *   Updating data with `update` and `updateMany`, and I also played with incrementing and decrementing numerical fields.
    *   Deleting records using `delete` and `deleteMany`.

*   **Filtering Power:**  I was really impressed by Prisma's filtering capabilities.  I wanted to explore how to precisely query data, so I included examples showing:
    *   Filtering with logical operators like `AND`, `OR`, and `NOT`.
    *   Using comparison operators like `gt`, `lt`, `gte`, `lte` for numerical comparisons.
    *   Filtering lists using `in` and `notIn`.
    *   String filtering with `contains` and how to make searches case-insensitive.

*   **Pagination Basics:**  For handling larger datasets, I wanted to understand pagination. I included a simple example of how to use `take` and `skip` to implement basic pagination in Prisma.

*   **Working with Relationships:**  Relationships are key in databases, so I dedicated examples to understanding how Prisma helps manage them. I experimented with:
    *   Connecting existing records using `connect` to link related data.
    *   Creating related records inline using nested `create` operations.
    *   Filtering queries based on related data to see how Prisma handles relationship-based queries.

*   **Enums in Action:**  I used an enum in my schema and wanted to make sure I understood how to work with enums in Prisma Client, so there are examples using the `Role` enum.

These scripts are designed to be straightforward and focused. My goal was to isolate each feature and understand it clearly through code.
