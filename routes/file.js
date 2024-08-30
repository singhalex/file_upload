const express = require("express");
const router = express.Router();

const fileController = require("../controllers/fileController");

// Download file on GET
router.get("/:id", fileController.download_file_get);

// Delete form on GET
router.get("/:id/delete", fileController.delete_file_get);

module.exports = router;
