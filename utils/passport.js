const passport = require('passport')
const bcrypt = require('bcryptjs')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

passport.use(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
  }
})