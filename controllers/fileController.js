const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const retreiveFolder = require("../utils/retrieveFolder");

// Initialize multer and store file in memory
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Upload file to folder on POST
exports.upload_file_post = [
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
    // Create unique file name
    const fullFileName = req.file.originalname.split(".");
    const truncFileName = fullFileName[0];
    const fileExtenstion = fullFileName[1];
    const uniqueFileName = `${truncFileName}-${uuidv4()}.${fileExtenstion}`;

    // Upload file to supabase
    const { data, error } = await supabase.storage
      .from("files")
      .upload(`${req.user.id}/${uniqueFileName}`, req.file.buffer);
    if (error) {
      // TODO - HANDLE ERROR HERE //
    }

    // Store file info in db
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        date: new Date(),
        type: fileExtenstion,
        folderId: parseInt(req.params.id),
        userId: req.user.id,
      },
    });
    next();
  }),
  retreiveFolder,
  (req, res, next) => {
    res.render("folder-view", { mode: "get", folder: req.folder });
  },
];
