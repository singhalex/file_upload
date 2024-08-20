var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async function (req, res, next) {
  if (req.user) {
    const folderQuery = await prisma.folder.findMany({
      where: {
        userId: req.user?.id,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            files: true,
          },
        },
      },
    });

    return res.render("index", { folders: folderQuery });
  }
  res.render("index", { folders: [] });
});

module.exports = router;
