const expressAsyncHandler = require("express-async-handler");

const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const mime = require("mime-types");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Upload file to folder on POST
exports.upload_file_post = [
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
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

  (req, res, next) => {
    res.send("UPLOAD FILE HERE");
  },
];
