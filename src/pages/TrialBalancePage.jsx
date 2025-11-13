import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function TrialBalancePage() {
  const [list, setList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });

  // Fetch trial balance data
  const loadTrialBalance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await axios.get(`${apiUrl}/trial-balance`, { params });
      const data = res.data?.trialBalance || [];

      // Calculate totals
      const totalDebit = data.reduce(
        (sum, i) => sum + parseFloat(i.debitAmount?.replace(/[₹,]/g, "") || 0),
        0
      );
      const totalCredit = data.reduce(
        (sum, i) => sum + parseFloat(i.creditAmount?.replace(/[₹,]/g, "") || 0),
        0
      );

      setList(data);
      setTotals({ debit: totalDebit, credit: totalCredit });
    } catch (err) {
      console.error("Failed to load trial balance:", err);
      alert("Failed to load trial balance from server");
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    loadTrialBalance();
  }, []);

  // Handle form submit
  const handleFilter = (e) => {
    e.preventDefault();
    loadTrialBalance();
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Trial Balance</h3>

      {/* Date Filter */}
      <form className="row g-3 align-items-end mb-4" onSubmit={handleFilter}>
        <div className="col-md-3">
          <label className="form-label fw-semibold">From Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">To Date</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Filter"}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Ledger Name</th>
                  <th className="text-end">Debit</th>
                  <th className="text-end">Credit</th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 ? (
                  list.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.ledgerName}</td>
                      <td className="text-end">{parseFloat(-item.debitAmount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}</td>
                      <td className="text-end">{parseFloat(item.creditAmount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      {loading ? "Loading data..." : "No Data Found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrialBalancePage;