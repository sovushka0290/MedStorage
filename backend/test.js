const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('DB connected');
  } catch (e) {
    console.log('DB ERROR', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
