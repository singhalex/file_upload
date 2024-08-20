const express = require("express");
const router = express.Router();

const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");

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
router.post("/:id", fileController.upload_file_post);

module.exports = router;
