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
    // Check file size and add error if too large
    if (req.file.size > 6000000) {
      req.errors = [{ msg: "File too large." }];
      return next();
    }
    // Create unique file name
    const fullFileName = req.file.originalname.split(".");
    const fileExtenstion = fullFileName.pop();
    const truncFileName = fullFileName.join(".");
    const uniqueFileName = `${truncFileName}-${uuidv4()}.${fileExtenstion}`;

    // Upload file to supabase
    const { data, error } = await supabase.storage
      .from("files")
      .upload(
        `${req.user.id}/${req.params.id}/${uniqueFileName}`,
        req.file.buffer
      );
    if (error) {
      throw new Error("Database error. Please try again.");
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
    res.render("folder-view", {
      mode: "get",
      folder: req.folder,
      errors: req.errors,
    });
  },
];

exports.download_file_get = [
  authorizeFile,
  expressAsyncHandler(async (req, res, next) => {
    // Retrieve raw data from supabase
    const { data, error } = await supabase.storage
      .from("files")
      .download(`${req.user.id}/${req.file.folderId}/${req.file.uniqueName}`);

    if (error) {
      throw new Error("Database error. Please try again.");
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
    req.file.id = req.params.id;
    res.render("delete-file", { file: req.file });
  },
];

// Delete file
exports.delete_file_post = [
  authorizeFile,
  // Delete file from db
  async (req, res, next) => {
    const deleted = await prisma.file.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // Delete file from storage
    const { error } = await supabase.storage
      .from("files")
      .remove(`${req.user.id}/${req.file.folderId}/${req.file.uniqueName}`);

    // Throw error if storage error
    if (error) {
      throw new Error("File Could not be deleted. Please try again.");
    }

    // Send user back to folder
    res.redirect(`/folder/${deleted.folderId}`);
  },
];

// Return to the containing folder
exports.file_return_folder_get = expressAsyncHandler(async (req, res, next) => {
  // Lookup folder of file
  const { folderId } = await prisma.file.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    select: {
      folderId: true,
    },
  });

  res.redirect(`/folder/${folderId}`);
});
