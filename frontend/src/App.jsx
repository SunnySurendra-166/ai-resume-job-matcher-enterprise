import { useState } from "react";
import axios from "axios";

export default function App() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [parsed, setParsed] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseResume = () => {
    if (!resume) {
      alert("Upload resume first");
      return;
    }
    setParsed(true);
    setResult(null);
  };

  const analyze = async () => {
    if (!parsed || !jobDesc) {
      alert("Parse resume and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDesc);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:5000/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #667eea, #764ba2, #ff6a88)"
    }}>
      <div style={{
        width: "420px",
        background: "#fff",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ textAlign: "center" }}>
          AI Resume Job Matcher
        </h2>

        {/* Upload */}
        <input
          type="file"
          onChange={(e) => {
            setResume(e.target.files[0]);
            setParsed(false);
          }}
        />

        {/* Parse */}
        <button
          onClick={parseResume}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {parsed ? "✓ Parsed" : "Parse Resume"}
        </button>

        {/* Job Description */}
        <textarea
          placeholder="Paste job description..."
          rows="4"
          style={{ width: "100%", marginTop: "10px" }}
          onChange={(e) => setJobDesc(e.target.value)}
          disabled={!parsed}
        />

        {/* Analyze */}
        <button
          onClick={analyze}
          style={{
            width: "100%",
            marginTop: "10px",
            background: "#6c63ff",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            border: "none"
          }}
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        {/* Result */}
        {result && (
          <div style={{ marginTop: "15px" }}>
            <h3>Match: {result.matchPercentage}%</h3>

            <p><b>Matched Skills:</b></p>
            <ul>
              {result.matchedSkills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <p><b>Missing Skills:</b></p>
            <ul>
              {result.missingSkills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}