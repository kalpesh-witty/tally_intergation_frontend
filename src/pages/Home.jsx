import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function Home() {
  const [companies, setCompanies] = useState([]);
  const [tallyStatus, setTallyStatus] = useState(null); // 'connected' | 'disconnected' | null
  const [checking, setChecking] = useState(false);

  // Load companies
  useEffect(() => {
    axios
      .get(`${apiUrl}/companies`)
      .then((res) => setCompanies(res.data.companies))
      .catch((err) => console.error(err));
  }, []);

  // Test Tally connection
  const checkTallyConnection = async () => {
    setChecking(true);
    try {
      const res = await axios.get(`${apiUrl}/test-tally`);
      if (res.data?.status === "connected") {
        setTallyStatus("connected");
      } else {
        setTallyStatus("disconnected");
      }
    } catch (err) {
      console.error("Tally connection failed", err);
      setTallyStatus("disconnected");
    } finally {
      setChecking(false);
    }
  };

  // Auto check on load
  useEffect(() => {
    checkTallyConnection();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>TallyPrime Server Status</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor:
              tallyStatus === "connected"
                ? "limegreen"
                : tallyStatus === "disconnected"
                ? "red"
                : "gray",
            boxShadow: tallyStatus === "connected"
              ? "0 0 6px limegreen"
              : tallyStatus === "disconnected"
              ? "0 0 6px red"
              : "none",
          }}
        ></div>

        <span
          style={{
            color:
              tallyStatus === "connected"
                ? "green"
                : tallyStatus === "disconnected"
                ? "red"
                : "gray",
            fontWeight: "bold",
          }}
        >
          {tallyStatus === "connected"
            ? "Connected to TallyPrime"
            : tallyStatus === "disconnected"
            ? "TallyPrime Not Running"
            : "Checking..."}
        </span>

        <button
          onClick={checkTallyConnection}
          disabled={checking}
          style={{
            marginLeft: "20px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {checking ? "Checking..." : "Recheck"}
        </button>
      </div>

      <h3>Current Company</h3>
      {companies.length > 0 ? (
        <ul>
          {companies.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      ) : (
        <p>No company data available</p>
      )}
    </div>
  );
}

export default Home;