const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function connectDB() {
    await prisma.$connect()
    console.log('Database Connected')
}

module.exports = { connectDB}