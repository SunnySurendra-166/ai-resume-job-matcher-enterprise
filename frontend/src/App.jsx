import { useState } from "react";
import "./App.css";

const API_URL = "https://ai-resume-job-matcher-enterprise.onrender.com";

function App() {
  const [resume, setResume] = useState(null);
  const [jobText, setJobText] = useState("");

  const [match, setMatch] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!resume && jobText.trim() === "") {
      alert("Please upload resume or paste job description");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (resume) formData.append("resume", resume);
    if (jobText) formData.append("text", jobText);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Backend response:", data); // 🔍 DEBUG

      // ✅ SAFE STATE SET (THIS FIXES EVERYTHING)
      setMatch(data.matchPercentage ?? 0);
      setMatchedSkills(Array.isArray(data.matchedSkills) ? data.matchedSkills : []);
      setMissingSkills(Array.isArray(data.missingSkills) ? data.missingSkills : []);

    } catch (err) {
      console.error("Analyze error:", err);
      alert("Analysis failed. Check console.");
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
        onChange={(e) => setResume(e.target.files[0])}
      />

      <textarea
        placeholder="Paste job description here..."
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
      />

      <button onClick={analyzeResume} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      <h2>{match}% Match</h2>

      <h3>Matched Skills</h3>
      {matchedSkills.length === 0 ? (
        <p>No matched skills found</p>
      ) : (
        <div className="skills matched">
          {matchedSkills.map((skill, idx) => (
            <span key={idx}>{skill}</span>
          ))}
        </div>
      )}

      <h3>Missing Skills</h3>
      {missingSkills.length === 0 ? (
        <p>No missing skills 🎉</p>
      ) : (
        <div className="skills missing">
          {missingSkills.map((skill, idx) => (
            <span key={idx}>{skill}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
