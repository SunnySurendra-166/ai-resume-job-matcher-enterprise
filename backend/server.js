const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --------------------
// MULTER CONFIG
// --------------------
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// --------------------
// HEALTH ROUTE
// --------------------
app.get("/health", (req, res) => {
  res.send("Backend is running ✅");
});

// --------------------
// SKILLS LIST
// --------------------
const skillsList = [
  "javascript",
  "react",
  "node",
  "express",
  "python",
  "java",
  "sql",
  "mongodb",
  "aws",
  "docker",
  "kubernetes",
  "linux",
  "git",
  "data structures",
  "backend development",
  "database systems"
];

// --------------------
// ANALYZE ROUTE
// --------------------
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: []
      });
    }

    const buffer = req.file.buffer;

    const data = await pdf(buffer);
    const resumeText = data.text.toLowerCase();
    const jobDescription = (req.body.jobDescription || "").toLowerCase();

    console.log("Resume text:", resumeText);
    console.log("Job description:", jobDescription);

    const matchedSkills = [];
    const missingSkills = [];

    skillsList.forEach(skill => {
      if (
        resumeText.includes(skill) &&
        jobDescription.includes(skill)
      ) {
        matchedSkills.push(skill);
      } else if (jobDescription.includes(skill)) {
        missingSkills.push(skill);
      }
    });

    const matchPercentage =
      skillsList.length === 0
        ? 0
        : Math.round((matchedSkills.length / skillsList.length) * 100);

    res.json({
      matchPercentage: matchPercentage || 0,
      matchedSkills: matchedSkills || [],
      missingSkills: missingSkills || []
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: []
    });
  }
});

// --------------------
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
