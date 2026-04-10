const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({ origin: true }));
app.use(express.json());

/* ---------- FILE UPLOAD ---------- */
const upload = multer({ storage: multer.memoryStorage() });

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* ---------- ANALYZE ---------- */
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    console.log("🔥 API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    if (!req.body.jobDescription) {
      return res.status(400).json({ error: "No job description" });
    }

    /* ---------- PARSE PDF ---------- */
    const data = await pdfParse(req.file.buffer);

    let resumeText = data.text.toLowerCase();
    let jobText = req.body.jobDescription.toLowerCase();

    /* ---------- NORMALIZE PHRASES ---------- */
    jobText = jobText.replace("deep learning", "deeplearning");

    /* ---------- EXTRACT WORDS FROM JD ---------- */
    let words = jobText.split(/\W+/).filter(w => w.length > 2);

    /* ---------- EXTRA SKILLS (IMPORTANT) ---------- */
    const extraSkills = [
      "django","flask","tensorflow","deeplearning",
      "blockchain","graphql","kafka","redis",
      "angular","vue","flutter","swift","kotlin"
    ];

    /* ---------- COMBINE JD SKILLS ---------- */
    const jdSkills = [...new Set([
      ...words,
      ...extraSkills.filter(skill => jobText.includes(skill))
    ])];

    /* ---------- MATCHED ---------- */
    const matchedSkills = jdSkills.filter(skill =>
      resumeText.includes(skill)
    );

    /* ---------- MISSING ---------- */
    const missingSkills = jdSkills.filter(skill =>
      !resumeText.includes(skill)
    );

    /* ---------- SCORE ---------- */
    const matchPercentage = Math.round(
      (matchedSkills.length / (jdSkills.length || 1)) * 100
    );

    /* ---------- RESPONSE ---------- */
    res.json({
      matchPercentage,
      matchedSkills,
      missingSkills
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- START SERVER ---------- */
app.listen(5000, () => {
  console.log("✅ Backend running at http://127.0.0.1:5000");
});