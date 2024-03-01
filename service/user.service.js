const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const { hashPassword } = require('../util/credentials')
const generateUniqueID = require('../util/generateUniqueID')
const createUser = async (username, email, password) => {
    const hash_password= await hashPassword(password);
    //console.log(hash_password)
    const user = await prisma.user.create({
        data: {
            id: generateUniqueID(),
            username:username,
            email:email,
            password:hash_password
        }
    })
    return user;
}

const loginUser = async (email, password) => {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })
    return user;
}


const validateUser = async (username, email) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    username
                },
                {
                    email
                }
            ]
        }
    })
    return user;
}

const getProfile = async (decoded) => {
    const user = await prisma.user.findFirst({
        where: {
            id:decoded.id
        }
    })
    return user;
}

module.exports = {
    createUser,
    validateUser,
    loginUser,
    getProfile
}