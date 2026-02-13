import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({ storage: storage });

export const uploadFile = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl });
};
