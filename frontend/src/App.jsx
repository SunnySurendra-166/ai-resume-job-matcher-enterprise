import { useState } from "react";
import "./App.css";

const API_URL = "https://ai-resume-job-matcher-enterprise.onrender.com";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [match, setMatch] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload resume and paste job description");
      return;
    }

    setLoading(true);
    setError("");
    setMatch(null);
    setMatchedSkills([]);
    setMissingSkills([]);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      setMatch(data.matchPercentage);
      setMatchedSkills(data.matchedSkills || []);
      setMissingSkills(data.missingSkills || []);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.open(`${API_URL}/download-report`, "_blank");
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
        placeholder="Paste Job Description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={10}
      />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {error && <p className="error">{error}</p>}

      {match !== null && (
        <>
          <h2>{match}% Match</h2>

          <h3>Matched Skills</h3>
          <div className="skills">
            {matchedSkills.map((skill, i) => (
              <span key={i} className="skill matched">
                {skill}
              </span>
            ))}
          </div>

          <h3>Missing Skills</h3>
          <div className="skills">
            {missingSkills.map((skill, i) => (
              <span key={i} className="skill missing">
                {skill}
              </span>
            ))}
          </div>

          <button onClick={handleDownloadPDF}>
            Download PDF Report
          </button>
        </>
      )}
    </div>
  );
}

export default App;
