import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";
import { FaSyncAlt, FaServer, FaBuilding } from "react-icons/fa";

function Home() {
  const [companies, setCompanies] = useState([]);
  const [tallyStatus, setTallyStatus] = useState(null); // 'connected' | 'disconnected' | null
  const [checking, setChecking] = useState(false);

  // 🔹 Load companies
  const loadCompanies = async () => {
    try {
      const res = await axios.get(`${apiUrl}/companies`);
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error("Failed to load companies", err);
    }
  };

  // 🔹 Test Tally connection
  const checkTallyConnection = async () => {
    setChecking(true);
    try {
      const res = await axios.get(`${apiUrl}/test-tally`);
      setTallyStatus(res.data?.status === "connected" ? "connected" : "disconnected");
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
    loadCompanies();
  }, []);

  // 🔹 Helper for status badge
  const getStatus = () => {
    if (tallyStatus === "connected")
      return <span className="badge bg-success px-3 py-2">Connected</span>;
    if (tallyStatus === "disconnected")
      return <span className="badge bg-danger px-3 py-2">Disconnected</span>;
    return <span className="badge bg-secondary px-3 py-2">Checking...</span>;
  };

  return (
    <div className="container py-4">
      {/* 🔹 Header */}
      <div className="d-flex align-items-center mb-4">
        <FaServer size={30} className="text-primary me-2" />
        <h3 className="mb-0 fw-bold text-primary">TallyPrime Server Dashboard</h3>
      </div>

      {/* 🔹 Tally Status Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div
              className={`rounded-circle ${
                tallyStatus === "connected"
                  ? "bg-success"
                  : tallyStatus === "disconnected"
                  ? "bg-danger"
                  : "bg-secondary"
              }`}
              style={{
                width: "16px",
                height: "16px",
                boxShadow:
                  tallyStatus === "connected"
                    ? "0 0 8px rgba(0,255,0,0.5)"
                    : tallyStatus === "disconnected"
                    ? "0 0 8px rgba(255,0,0,0.5)"
                    : "none",
              }}
            ></div>

            <div>
              <h5 className="mb-1">Tally Connection Status</h5>
              <p className="mb-0">
                {tallyStatus === "connected"
                  ? "Connected to TallyPrime successfully."
                  : tallyStatus === "disconnected"
                  ? "TallyPrime is not running or not reachable."
                  : "Checking connection..."}
              </p>
            </div>
          </div>

          <div className="mt-3 mt-md-0 d-flex align-items-center gap-3">
            {getStatus()}
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={checkTallyConnection}
              disabled={checking}
            >
              <FaSyncAlt className={checking ? "fa-spin" : ""} />
              {checking ? "Checking..." : "Recheck"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Company List */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FaBuilding className="me-2" />
          <h5 className="mb-0">Loaded Companies</h5>
        </div>
        <div className="card-body">
          {companies.length > 0 ? (
            <ul className="list-group list-group-flush">
              {companies.map((company, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  <span>{company}</span>
                  <span className="text-muted small">Company {index + 1}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mb-0">No company data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;