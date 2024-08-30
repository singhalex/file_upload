const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const retreiveFolder = require("../utils/retrieveFolder");
const authorizeFolder = require("../utils/authorizeFolder");
const authorizeFile = require("../utils/authorizeFile");

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

const stream = require("stream");

// Upload file to folder on POST
exports.upload_file_post = [
  authorizeFolder,
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
    // Create unique file name
    const fullFileName = req.file.originalname.split(".");
    const fileExtenstion = fullFileName.pop();
    const truncFileName = fullFileName.join(".");
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
        uniqueName: uniqueFileName,
        size: req.file.size,
        date: new Date(),
        type: req.file.mimetype,
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

exports.download_file_get = [
  authorizeFile,
  expressAsyncHandler(async (req, res, next) => {
    // Retrieve raw data from supabase
    const { data, error } = await supabase.storage
      .from("files")
      .download(`${req.user.id}/${req.file.uniqueName}`);

    if (error) {
      throw error;
    }

    // Convert raw data to readable file
    const buffer = Buffer.from(await data.arrayBuffer());
    const fileContents = Buffer.from(buffer, "base64");
    const readStream = new stream.PassThrough();
    readStream.end(fileContents);

    // Set headers
    const setHeader = {
      "Content-Disposition": `attachment; filename=${req.file.originalFileName}`,
      "Content-Type": req.file.type,
    };
    res.set(setHeader);

    // Trigger download
    readStream.pipe(res);
  }),
];

exports.delete_file_get = [
  authorizeFile,
  (req, res, next) => {
    console.log(req.params.id);
    res.render("delete-file", { name: res.originalFileName });
  },
];
