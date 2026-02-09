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

  const analyzeMatch = async () => {
    setLoading(true);

    const formData = new FormData();
    if (resume) formData.append("resume", resume);
    if (jobText) formData.append("text", jobText);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("API Response:", data);

      // ✅ DEFENSIVE STATE SET
      setMatch(data.matchPercentage ?? 0);
      setMatchedSkills(Array.isArray(data.matchedSkills) ? data.matchedSkills : []);
      setMissingSkills(Array.isArray(data.missingSkills) ? data.missingSkills : []);
    } catch (err) {
      console.error(err);
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

      <button onClick={analyzeMatch}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      <h2>{match}% Match</h2>

      <h3>Matched Skills</h3>
      {matchedSkills.length === 0 ? (
        <p>No matched skills found</p>
      ) : (
        <div className="skills matched">
          {matchedSkills.map((skill, i) => (
            <span key={i}>{skill}</span>
          ))}
        </div>
      )}

      <h3>Missing Skills</h3>
      {missingSkills.length === 0 ? (
        <p>No missing skills 🎉</p>
      ) : (
        <div className="skills missing">
          {missingSkills.map((skill, i) => (
            <span key={i}>{skill}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
