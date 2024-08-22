const asyncHandeler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeFolder = require("../utils/authorizeFolder");
const retrieveFolder = require("../utils/retrieveFolder");

// Create new folder on POST
exports.folder_post = [
  body("folder")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name cannot be blank"),
  // Check for duplicate folder name
  body("folder").custom(
    asyncHandeler(async (value, { req }) => {
      const folderObject = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          folders: true,
        },
      });

      const folders = folderObject.folders;
      // Attach folders to req object to be rendered if errors
      req.folders = folders;

      const match = folders.find((folder) => folder.name === value);
      if (match) {
        throw new Error("Folder name already exists");
      }
    })
  ),
  asyncHandeler(async (req, res, next) => {
    // Render homepage with errors if any
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.render("index", { errors, folders: req.folders });
    }

    // Create new folder in db
    await prisma.folder.create({
      data: {
        name: req.body.folder,
        userId: req.user.id,
      },
    });

    return res.redirect("/");
  }),
];

// Show folder detail on GET
exports.single_folder_get = [
  authorizeFolder,
  retrieveFolder,
  (req, res, next) => {
    res.render("folder-view", { folder: req.folder, mode: "get" });
  },
];

// Show folder delete form on GET
exports.delete_folder_get = [
  authorizeFolder,
  retrieveFolder,
  (req, res, next) => {
    res.render("folder-view", { folder: req.folder, mode: "delete" });
  },
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
  retrieveFolder,
  (req, res, next) => {
    res.render("folder-view", { folder: req.folder, mode: "rename" });
  },
];

// Rename folder on POST
exports.rename_folder_post = [
  authorizeFolder,
  retrieveFolder,
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
    // Re-render page if there are errors
    if (errors.length > 0) {
      return res.render("folder-view", {
        errors,
        mode: "rename",
        folder: req.folder,
        folderNameValue: req.body.newName,
      });
    }

    // Update folder name in db
    await prisma.folder.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.newName,
      },
    });

    // Update the folder name on the req object
    req.folder.name = req.body.newName;
    res.render("folder-view", { mode: "rename", folder: req.folder });
  }),
];
