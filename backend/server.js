const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

/* ============================
   HEALTH CHECK (Render needs this)
============================ */
app.get("/health", (req, res) => {
  res.send("Backend is running ✅");
});

/* ============================
   ENTERPRISE ATS SKILLS
============================ */
const ALL_SKILLS = [
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
  "cyber security",
  "information security",
  "incident response",
  "vulnerability"
];

/* ============================
   ANALYZE ROUTE (FINAL FIX)
============================ */
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    let resumeText = "";
    let jobDescription = "";

    /* ---------- PDF UPLOAD ---------- */
    if (req.file && req.file.buffer) {
      const data = await pdf(req.file.buffer);
      resumeText = data.text || "";
    }

    /* ---------- TEXT INPUT ---------- */
    if (req.body.text && req.body.text.trim().length > 0) {
      jobDescription = req.body.text;
    }

    // 🔍 DEBUG LOGS (VERY IMPORTANT)
    console.log("===== DEBUG =====");
    console.log("Resume text length:", resumeText.length);
    console.log("Job description length:", jobDescription.length);

    // ❌ Safety check
    if (!resumeText.trim()) {
      return res.json({
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: ALL_SKILLS
      });
    }

    const combinedText = `${resumeText} ${jobDescription}`.toLowerCase();

    /* ---------- STRICT ATS MATCHING ---------- */
    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of ALL_SKILLS) {
      const regex = new RegExp(`\\b${skill.replace(" ", "\\s+")}\\b`, "i");
      if (regex.test(combinedText)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const matchPercentage = Math.round(
      (matchedSkills.length / ALL_SKILLS.length) * 100
    );

    /* ---------- FINAL RESPONSE (MANDATORY FORMAT) ---------- */
    return res.json({
      matchPercentage,
      matchedSkills,
      missingSkills
    });

  } catch (error) {
    console.error("Analyze error:", error);
    return res.status(500).json({
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: ALL_SKILLS
    });
  }
});

/* ============================
   START SERVER (Render compatible)
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
