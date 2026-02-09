import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);

  const analyze = async () => {
    const formData = new FormData();
    if (file) formData.append("resume", file);
    if (text) formData.append("text", text);

    const res = await axios.post(
      "http://127.0.0.1:5000/analyze",
      formData
    );

    setScore(res.data.score);
    setMatched(res.data.matched);
    setMissing(res.data.missing);
  };

  const downloadPDF = async () => {
    const res = await axios.post(
      "http://127.0.0.1:5000/report",
      { score, matched, missing },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ATS_Report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="container">
      <h1>AI Resume Job Matcher</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <textarea
        placeholder="Paste job description here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyze}>Analyze Match</button>

      <h2>{score}% Match</h2>

      <div className="skills-vertical">
        <h3>Matched Skills</h3>
        <div className="pill-container">
          {matched.map((s, i) => (
            <span key={i} className="pill matched">
              {s.skill}
            </span>
          ))}
        </div>

        <h3 style={{ marginTop: "20px" }}>Missing Skills</h3>
        <div className="pill-container">
          {missing.map((s, i) => (
            <span key={i} className="pill missing">
              {s.skill}
            </span>
          ))}
        </div>
      </div>

      <button onClick={downloadPDF}>Download PDF Report</button>
    </div>
  );
}

export default App;
