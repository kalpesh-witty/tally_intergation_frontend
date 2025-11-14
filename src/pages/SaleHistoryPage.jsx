import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function SaleHistoryPage() {
  const [sales, setSales] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  // Load sales history
  const loadSales = async () => {
    try {
      const res = await axios.get(`${apiUrl}/sales-history`);
      setSales(res.data.sales || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load sales history");
    }
  };

  // Auto-load on page load
  useEffect(() => {
    loadSales();
  }, []);

  // Toggle expand row
  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Helper to format date (YYYYMMDD → DD-MM-YYYY)
  const formatDate = (d) =>
    d && d.length === 8
      ? `${d.slice(6, 8)}-${d.slice(4, 6)}-${d.slice(0, 4)}`
      : d;

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-success mb-4">Sales History</h3>
      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "12%" }}>Date</th>
                  <th style={{ width: "15%" }}>Voucher No</th>
                  <th style={{ width: "15%" }}>Order Ref.</th>
                  <th style={{ width: "20%" }}>Party Name</th>
                  <th style={{ width: "10%" }}>Amount</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((s, idx) => {
                    const total = s.items.reduce(
                      (sum, i) => sum + Math.abs(parseFloat(i.amount || 0)),
                      0
                    );
                    return (
                      <>
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{formatDate(s.date)}</td>
                          <td>{s.voucherNumber}</td>
                          <td>{s.orderNo}</td>
                          <td>{s.partyName}</td>
                          <td>₹ {total.toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => toggleExpand(idx)}
                            >
                              {expandedRow === idx ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Item List */}
                        {expandedRow === idx && (
                          <tr className="bg-light">
                            <td colSpan="7">
                              <div className="p-3">
                                <h6 className="fw-semibold text-secondary mb-3">
                                  Item Details
                                </h6>
                                <table className="table table-sm table-bordered">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Item Name</th>
                                      <th>Quantity</th>
                                      <th>Rate</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {s.items.map((i, iidx) => (
                                      <tr key={iidx}>
                                        <td>{i.stockItem}</td>
                                        <td>{i.quantity}</td>
                                        <td>{i.rate}</td>
                                        <td>
                                          {parseFloat(i.amount || 0).toLocaleString(
                                            "en-IN",
                                            {
                                              minimumFractionDigits: 2,
                                            }
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-3">
                      No Sales Records Found
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

export default SaleHistoryPage;
