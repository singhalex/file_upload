const asyncHandeler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mime = require("mime-types");

const authorizeFolder = require("../utils/authorizeFolder");

// Create new folder on POST
exports.folder_post = [
  body("folder")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name cannot be blank"),
  body("folder").custom(
    asyncHandeler(async (value, { req }) => {
      let folders = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          folders: true,
        },
      });

      folders = folders.folders;
      req.folders = folders;

      const match = folders.find((folder) => folder.name === value);
      if (match) {
        throw new Error("Folder name already exists");
      }
    })
  ),
  asyncHandeler(async (req, res, next) => {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      console.log(errors);
      return res.render("index", { errors, folders: req.folders });
    }

    // CHECK BELOW
    console.log(req.user);
    console.log(req.body.folder);
    await prisma.folder.create({
      data: {
        name: req.body.folder,
        userId: req.user.id,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        folders: true,
      },
    });

    console.log(user.folders);
    res.send("New folder created!");
  }),
];

// Show folder detail on GET
exports.single_folder_get = [
  authorizeFolder,
  asyncHandeler(async (req, res, next) => {
    const folder = await prisma.folder.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (folder.userId === req.user.id) {
      res.render("folder-view", { folder, mode: "get" });
    } else {
      res.send("You are not authorized to view this folder");
    }
  }),
];

// Show folder delete form on GET
exports.delete_folder_get = [
  authorizeFolder,
  asyncHandeler(async (req, res, next) => {
    const folder = await prisma.folder.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.render("folder-view", { folder, mode: "delete" });
  }),
];

// Delete folder on POST
exports.delete_folder_post = [
  authorizeFolder,
  asyncHandeler(async (req, res, next) => {
    console.log(req.params.id);
    await prisma.folder.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.redirect("/");
  }),
];

// Show folder rename form on GET
exports.rename_folder_get = [
  authorizeFolder,
  asyncHandeler(async (req, res, next) => {
    const folder = await prisma.folder.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.render("folder-view", { folder, mode: "rename" });
  }),
];

// Rename folder on POST
exports.rename_folder_post = [
  authorizeFolder,
  body("newName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name cannot be blank"),
  body("newName").custom(async (value, { req }) => {
    // Get all user folders
    const userFolders = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        folders: true,
      },
    });

    // Extract array of folders
    const folders = userFolders.folders;
    // See if input value is found in array
    const match = folders.find((folder) => folder.name === value);
    if (match) {
      throw new Error("Folder name already exists");
    }
  }),
  asyncHandeler(async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      // Get folder from db
      const folder = await prisma.folder.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.render("folder-view", {
        errors,
        mode: "rename",
        folder,
        folderNameValue: req.body.newName,
      });
    }

    // Update folder name in db
    const updatedFolder = await prisma.folder.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.newName,
      },
    });
    res.render("folder-view", { mode: "rename", folder: updatedFolder });
  }),
];

// Upload file to folder on POST
exports.upload_to_folder_post = [
  upload.single("file"),

  (req, res, next) => {
    const mimeType = req.file.mimetype;
    console.log(mimeType);
    console.log(mime.extension(mimeType));
    // console.log(req.file);

    res.send("UPLOAD FILE HERE");
  },
];
