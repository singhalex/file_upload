const asyncHandeler = require("express-async-handler");
const formatBytes = require("../utils/formatBytes");
const { DateTime } = require("luxon");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Utility to retreive a specific folder and attach it to the req object
const retrieveFolder = asyncHandeler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      files: true,
    },
  });

  // Format files for display
  folder.files.forEach((file) => {
    // Remove extension
    const fullFileNameArray = file.name.split(".");
    file.extension = fullFileNameArray.pop();
    const truncFileNameArray = fullFileNameArray;
    file.name = truncFileNameArray.join(".");
    file.size = formatBytes(file.size);
    file.date = DateTime.fromJSDate(file.date).toLocaleString(
      DateTime.DATE_SHORT
    );
  });
  req.folder = folder;
  next();
});

module.exports = retrieveFolder;
