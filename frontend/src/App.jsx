import { useState } from "react";
import "./App.css";

// ✅ Render backend URL
const API_URL = "https://ai-resume-job-matcher-enterprise.onrender.com";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [match, setMatch] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // ✅ FINAL SAFE ANALYZE HANDLER
  // ==============================
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Upload resume & paste job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDesc);

    try {
      setLoading(true);

      const controller = new AbortController();
      setTimeout(() => controller.abort(), 20000); // 20s timeout

      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      setMatch(data.matchPercentage);
      setMatchedSkills(data.matchedSkills);
      setMissingSkills(data.missingSkills);
    } catch (err) {
      console.error(err);
      alert("Analysis failed or timed out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Resume Job Matcher</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResumeFile(e.target.files[0])}
      />

      <textarea
        placeholder="Paste job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        rows={8}
      />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      <h2>{match}% Match</h2>

      <h3>Matched Skills</h3>
      <div className="skills">
        {matchedSkills.map((s, i) => (
          <span key={i} className="skill matched">
            {s}
          </span>
        ))}
      </div>

      <h3>Missing Skills</h3>
      <div className="skills">
        {missingSkills.map((s, i) => (
          <span key={i} className="skill missing">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
