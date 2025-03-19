const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    interests: String,
    reason: String,
    contribute: String,
    improvements: String
});

const Form = mongoose.model("Form", formSchema);

app.post("/submit-form", async (req, res) => {
    try {
        const formData = new Form(req.body);
        await formData.save();
        res.status(201).send("Form submitted successfully");
    } catch (error) {
        res.status(500).send("Error saving data");
    }
});

const VideoSchema = new mongoose.Schema({
    url: String,
    uploadedBy: String
});
const video = mongoose.model("Video", VideoSchema, "videos");

app.get("/get-videos", async (req, res) => {
    try {
        const videos = await Video.find({});
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// set storage engine
const storage = multer.diskStorage({
    destination: "public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload Route
app.post("/upload-video", upload.single("video"), async (req, res) => {
    try {
        const video = new Video({
            url: `/uploads/${req.file.filename}`,
            uploadedBy: "Rugved Joshi" // Replace with actual user
        });

        await video.save();
        res.json({ success: true, message: "Video uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed!" });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
