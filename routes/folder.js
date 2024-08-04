const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const folderController = require("../controllers/folderController");

router.post("/", folderController.folder_post);

router.delete("/", (req, res, next) => {
  res.send("DELETED");
});

router.get("/:id", folderController.single_folder_get);

module.exports = router;
