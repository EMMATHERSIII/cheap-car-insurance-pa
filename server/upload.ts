import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "client/public/images/blog");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `blog-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb: any) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

export const uploadMiddleware = upload.single("file");

export async function handleImageUpload(req: Request & { file?: Express.Multer.File }, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Return the public URL
    const imageUrl = `/images/blog/${req.file.filename}`;
    
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
}
