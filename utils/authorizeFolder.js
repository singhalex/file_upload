const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeFolder = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const check = await prisma.folder.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        userId: true,
      },
    });

    if (check.userId === req.user?.id) {
      return next();
    }
  }

  const err = new Error("You are not authorized to view this page");
  return next(err);
};

module.exports = authorizeFolder;
