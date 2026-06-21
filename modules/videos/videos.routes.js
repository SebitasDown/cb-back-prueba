// Express endpoints
// define the endpoints and connect them with the controller.

import express from "express";
import multer from "multer";
import path from "path";
import {
  createVideo,
  getAllVideosController,
  updateVideoController,
  deleteVideoController,
  getUploadSignature,
} from "./videos.controller.js";

const router = express.Router();

// Multer — only used for UPDATE (PUT) which still receives a file
const storage = multer.diskStorage({
  destination: "/tmp",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/quicktime",
    ];
    const allowedExtensions = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".qt"];

    if (allowedTypes.includes(file.mimetype)) return cb(null, true);

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) return cb(null, true);

    cb(new Error("Invalid file type. Only video files are allowed."), false);
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Multer error handler
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 100MB." });
    }
    return res.status(400).json({ error: "File upload error: " + error.message });
  }

  if (error.message === "Invalid file type. Only video files are allowed.") {
    return res
      .status(400)
      .json({ error: "Invalid file type. Only video files are allowed." });
  }

  next(error);
};

// ────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────

// Frontend calls this first to get a secure Cloudinary signature
router.get("/upload-signature", getUploadSignature);

// Frontend calls this after the video is uploaded directly to Cloudinary,
// passing only metadata (url, public_id, duration, title, etc.)
// No file upload happens here — backend stays lean and Vercel-friendly.
router.post("/create", createVideo);

router.get("/", getAllVideosController);
router.put("/:id", upload.single("file"), handleMulterError, updateVideoController);
router.delete("/:id", deleteVideoController);

export default router;
