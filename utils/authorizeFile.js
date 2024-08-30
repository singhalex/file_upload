const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeFile = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { name, uniqueName, type, userId } = await prisma.file.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        name: true,
        uniqueName: true,
        type: true,
        userId: true,
      },
    });
    if (userId === req.user.id) {
      const file = {
        originalFileName: name,
        uniqueName: uniqueName,
        type: type,
      };
      req.file = file;
      return next();
    }
  }

  const err = new Error("You are not authorized to download this file");
  return next(err);
};

module.exports = authorizeFile;
