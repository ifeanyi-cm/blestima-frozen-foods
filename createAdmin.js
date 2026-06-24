const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin =
      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });

    console.log(
      "Admin created successfully:"
    );

    console.log(admin);

  } catch (error) {

    console.error(error);

  } finally {

    await prisma.$disconnect();

  }
}

createAdmin();