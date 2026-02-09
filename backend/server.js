const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors({
  origin: "*"
}));

const upload = multer({ dest: "uploads/" });

app.get("/health", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ error: "Missing data" });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    fs.unlinkSync(req.file.path); // cleanup temp file

    const resumeText = pdfData.text.toLowerCase();
    const jobText = req.body.jobDescription.toLowerCase();

    const skills = [
      "javascript","react","node","express","python","java",
      "sql","mongodb","aws","linux","git","docker","kubernetes",
      "cyber security","incident response","vulnerability"
    ];

    const matchedSkills = skills.filter(
      s => resumeText.includes(s) && jobText.includes(s)
    );

    const missingSkills = skills.filter(
      s => jobText.includes(s) && !resumeText.includes(s)
    );

    const matchPercentage = jobText.length === 0
      ? 0
      : Math.round((matchedSkills.length / skills.length) * 100);

    return res.json({
      matchPercentage,
      matchedSkills,
      missingSkills
    });

  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({ error: "Analysis failed" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
