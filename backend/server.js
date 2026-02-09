const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const app = express();
const upload = multer(); // memory storage

app.use(cors());
app.use(express.json());

// ==============================
// ENTERPRISE ATS SKILL DATABASE
// ==============================
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
  "vulnerability",
];

// ==============================
// HEALTH CHECK
// ==============================
app.get("/health", (req, res) => {
  res.send("Backend is running");
});

// ==============================
// ANALYZE ROUTE (ATS-CORRECT)
// ==============================
app.post("/analyze", upload.single("resume"), (req, res) => {
  let resumeText = "";

  // Case 1: PDF uploaded
  if (req.file) {
    resumeText = req.file.buffer.toString("utf-8");
  }

  // Case 2: Text pasted
  if (req.body.text && req.body.text.trim().length > 0) {
    resumeText = req.body.text;
  }

  // Safety check
  if (!resumeText || resumeText.trim().length === 0) {
    return res.json({
      score: 0,
      matched: [],
      missing: ALL_SKILLS.map((s) => ({ skill: s })),
    });
  }

  resumeText = resumeText.toLowerCase();

  // ✅ STRICT WORD-BOUNDARY MATCHING (REAL ATS)
  const matched = ALL_SKILLS.filter((skill) => {
    const regex = new RegExp(`\\b${skill.replace(" ", "\\s+")}\\b`, "i");
    return regex.test(resumeText);
  }).map((s) => ({ skill: s }));

  const missing = ALL_SKILLS.filter((skill) => {
    const regex = new RegExp(`\\b${skill.replace(" ", "\\s+")}\\b`, "i");
    return !regex.test(resumeText);
  }).map((s) => ({ skill: s }));

  const score = Math.round(
    (matched.length / ALL_SKILLS.length) * 100
  );

  res.json({ score, matched, missing });
});

// ==============================
// PDF REPORT ROUTE
// ==============================
app.post("/report", (req, res) => {
  const { score, matched, missing } = req.body;

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=ATS_Report.pdf"
  );

  doc.pipe(res);

  doc.fontSize(20).text("ATS Resume Match Report\n\n");
  doc.fontSize(14).text(`Match Score: ${score}%\n\n`);

  doc.fontSize(16).text("Matched Skills:\n");
  matched.forEach((s) => {
    doc.fontSize(12).text(`• ${s.skill}`);
  });

  doc.moveDown();

  doc.fontSize(16).text("Missing Skills:\n");
  missing.forEach((s) => {
    doc.fontSize(12).text(`• ${s.skill}`);
  });

  doc.end();
});

// ==============================
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
