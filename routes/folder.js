const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const folderController = require("../controllers/folderController");

// Create a new folder on POST
router.post("/", folderController.folder_post);

// Render folder details on GET
router.get("/:id", folderController.single_folder_get);

// Render folder delete form on GET
router.get("/:id/delete", folderController.delete_folder_get);

// Delete folder on POST
router.post("/:id/delete", folderController.delete_folder_post);

// Render rename folder form GET
router.get("/:id/rename", folderController.rename_folder_get);

// Rename folder on POST
router.post("/:id/rename", folderController.rename_folder_post);

// Upload file to folder on POST
router.post("/:id", folderController.upload_to_folder_post);

module.exports = router;
