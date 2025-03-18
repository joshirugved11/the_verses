const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
