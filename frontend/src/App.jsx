import { useState } from "react";
import "./App.css";

const API_URL = "https://ai-resume-job-matcher-enterprise.onrender.com";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [match, setMatch] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  const analyzeMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      alert("Please upload resume and paste job description");
      return;
    }

    setLoading(true);
    setMatch(0);
    setMatchedSkills([]);
    setMissingSkills([]);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      // ✅ SAFE defaults (THIS FIXES THE CRASH)
      setMatch(data.matchPercentage || 0);
      setMatchedSkills(Array.isArray(data.matchedSkills) ? data.matchedSkills : []);
      setMissingSkills(Array.isArray(data.missingSkills) ? data.missingSkills : []);

    } catch (error) {
      console.error("Analyze failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI Resume Job Matcher</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResumeFile(e.target.files[0])}
      />

      <textarea
        placeholder="Paste job description here..."
        rows="8"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button onClick={analyzeMatch} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      <h2>{match}% Match</h2>

      <h3>Matched Skills</h3>
      {matchedSkills.length === 0 ? (
        <p>No matched skills found</p>
      ) : (
        <div className="skills">
          {matchedSkills.map((skill, index) => (
            <span key={index} className="skill matched">
              {skill}
            </span>
          ))}
        </div>
      )}

      <h3>Missing Skills</h3>
      {missingSkills.length === 0 ? (
        <p>No missing skills 🎉</p>
      ) : (
        <div className="skills">
          {missingSkills.map((skill, index) => (
            <span key={index} className="skill missing">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
