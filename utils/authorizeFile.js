const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeFile = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { name, userId, uniqueName } = await prisma.file.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        name: true,
        uniqueName: true,
        userId: true,
      },
    });
    if (userId === req.user.id) {
      req.uniqueName = uniqueName;
      req.originalFileName = name;
      return next();
    }
  }

  const err = new Error("You are not authorized to download this file");
  return next(err);
};

module.exports = authorizeFile;
