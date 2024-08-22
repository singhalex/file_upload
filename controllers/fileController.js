const expressAsyncHandler = require("express-async-handler");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fullFileName = file.originalname.split(".");
    const truncFileName = fullFileName[0];
    const extension = fullFileName[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, truncFileName + "-" + uniqueSuffix + "." + extension);
  },
});
const upload = multer({ storage });
const mime = require("mime-types");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const retreiveFolder = require("../utils/retrieveFolder");

// Upload file to folder on POST
exports.upload_file_post = [
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
    console.log(req.file);
    console.log(mime.extension(req.file.mimetype));
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        url: req.file.path,
        date: new Date(),
        type: mime.extension(req.file.mimetype),
        folderId: parseInt(req.params.id),
        userId: req.user.id,
      },
    });
    console.log(file);
    next();
  }),

  retreiveFolder,
  (req, res, next) => {
    res.render("folder-view", { mode: "get", folder: req.folder });
  },
];
