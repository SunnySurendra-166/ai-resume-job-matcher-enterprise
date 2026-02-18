import { useState } from "react";

const API_URL = "https://ai-resume-job-matcher-enterprise.onrender.com";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeMatch = async () => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      console.log("Response:", data);

      setMatchPercentage(data.matchPercentage || 0);
      setMatchedSkills(data.matchedSkills || []);
      setMissingSkills(data.missingSkills || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>AI Resume Job Matcher</h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <textarea
          placeholder="Paste job description..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={analyzeMatch} style={styles.button}>
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        <h2>{matchPercentage}% Match</h2>

        <h3>Matched Skills</h3>
        {matchedSkills.length === 0 ? (
          <p>No matched skills found</p>
        ) : (
          matchedSkills.map((skill, index) => (
            <p key={index}>{skill}</p>
          ))
        )}

        <h3>Missing Skills</h3>
        {missingSkills.length === 0 ? (
          <p>No missing skills 🎉</p>
        ) : (
          missingSkills.map((skill, index) => (
            <p key={index}>{skill}</p>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    width: "500px"
  },
  textarea: {
    width: "100%",
    height: "120px",
    marginTop: "10px",
    marginBottom: "10px"
  },
  button: {
    padding: "10px 20px",
    marginBottom: "20px"
  }
};

export default App;
