import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function ProfitAndLossPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfitLoss = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/profit-loss`, {
        params: { fromDate, toDate },
      });
      setReport(res.data.profitLoss || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load Profit & Loss data");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on mount
  useEffect(() => {
    fetchProfitLoss();
  }, []);

  // Calculate totals
  const total = report.reduce(
    (sum, r) =>
      sum +
      (parseFloat(r.subAmount || 0) || 0) +
      (parseFloat(r.mainAmount || 0) || 0),
    0
  );

  const totalDebit = report
    .filter(
      (r) => parseFloat(r.subAmount || r.mainAmount || 0) < 0 // negative = debit/expense
    )
    .reduce(
      (sum, r) =>
        sum +
        Math.abs(parseFloat(r.subAmount || r.mainAmount || 0) || 0),
      0
    );

  const totalCredit = report
    .filter(
      (r) => parseFloat(r.subAmount || r.mainAmount || 0) > 0 // positive = credit/income
    )
    .reduce(
      (sum, r) => sum + (parseFloat(r.subAmount || r.mainAmount || 0) || 0),
      0
    );

  const netResult = totalCredit - totalDebit;
  const netType = netResult >= 0 ? "Profit" : "Loss";

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">📊 Profit & Loss Statement</h3>

      {/* Date Filter */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={fetchProfitLoss}
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Report"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Account Name</th>
                  <th className="text-end">Debit (₹)</th>
                  <th className="text-end">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {report.length > 0 ? (
                  report.map((r, i) => {
                    const amount =
                      parseFloat(r.subAmount || r.mainAmount || 0) || 0;
                    const isDebit = amount < 0;
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{r.account}</td>
                        <td className="text-end text-danger">
                          {isDebit
                            ? Math.abs(amount).toLocaleString("en-IN")
                            : "-"}
                        </td>
                        <td className="text-end text-success">
                          {!isDebit
                            ? amount.toLocaleString("en-IN")
                            : "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Totals */}
              {report.length > 0 && (
                <tfoot>
                  <tr className="fw-bold table-light">
                    <td></td>
                    <td>Total</td>
                    <td className="text-end text-danger">
                      {totalDebit.toLocaleString("en-IN")}
                    </td>
                    <td className="text-end text-success">
                      {totalCredit.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr
                    className={`fw-bold ${
                      netType === "Profit" ? "table-success" : "table-danger"
                    }`}
                  >
                    <td></td>
                    <td>{netType}</td>
                    <td colSpan="2" className="text-end">
                      {Math.abs(netResult).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLossPage;