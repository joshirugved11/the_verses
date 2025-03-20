// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Multer Storage Configuration for File Uploads
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ Route for Form Submission
app.post("/submit-form", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("forms")
            .insert([req.body]);

        if (error) throw error;
        res.status(201).json({ success: true, message: "Form submitted successfully" });
    } catch (error) {
        console.error("Form Submission Error:", error);
        res.status(500).json({ success: false, message: "Error saving form data" });
    }
});

// ✅ Route to Fetch Uploaded Videos
app.get("/get-videos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("videos")
            .select("*");

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ success: false, message: "Error fetching videos" });
    }
});

// ✅ Route for Video Upload
app.post("/upload-video", upload.single("video"), async (req, res) => {
    try {
        const { data, error } = await supabase
            .storage
            .from("videos")
            .upload(`uploads/${req.file.filename}`, req.file.buffer, { contentType: req.file.mimetype });

        if (error) throw error;

        const videoURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/videos/uploads/${req.file.filename}`;

        await supabase.from("videos").insert([{ url: videoURL, uploadedBy: req.body.uploadedBy || "Anonymous" }]);

        res.status(201).json({ success: true, message: "Video uploaded successfully!", videoURL });
    } catch (error) {
        console.error("Video Upload Error:", error);
        res.status(500).json({ success: false, message: "Upload failed!" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
