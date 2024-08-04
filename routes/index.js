var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async function (req, res, next) {
  let folders = [];
  if (req.user) {
    folders = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        folders: true,
      },
    });

    folders = folders.folders;
  }
  res.render("index", { folders });
});

module.exports = router;
