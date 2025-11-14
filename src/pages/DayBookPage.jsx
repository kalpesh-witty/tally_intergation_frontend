import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function DayBookPage() {
  const [list, setList] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [voucherType, setVoucherType] = useState("All");
  const [total, setTotal] = useState(0);

  const loadDayBook = async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (voucherType !== "All") params.voucherType = voucherType;

      const res = await axios.get(`${apiUrl}/day-book`, { params });
      const data = res.data?.dayBook || [];
      setList(data);

      const totalAmount = data.reduce(
        (sum, v) => sum + (parseFloat(v.amount || 0) || 0),
        0
      );
      setTotal(totalAmount);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch Day Book");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDayBook();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadDayBook();
  };

  const formatDate = (d) => {
    if (!d) return "";
    if (d.includes("-")) return d;
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">📘 Day Book</h3>

      {/* Filter Section */}
      <form onSubmit={handleFilter} className="row g-2 align-items-end mb-4">
        <div className="col-md-3">
          <label className="form-label fw-semibold">From Date</label>
          <input
            type="date"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">To Date</label>
          <input
            type="date"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Voucher Type</label>
          <select
            className="form-select"
            value={voucherType}
            onChange={(e) => setVoucherType(e.target.value)}
            disabled={loading}
          >
            <option value="All">All</option>
            <option value="Purchase Order">Purchase Order</option>
            <option value="Receipt Note">Receipt Note</option>
            <option value="Payment">Payment</option>
            <option value="Purchase">Purchase</option>
            <option value="Sales Order">Sales Order</option>
            <option value="Delivery Note">Delivery Note</option>
            <option value="Sales">Sales</option>
            <option value="Receipt">Receipt</option>
          </select>
        </div>
        <div className="col-md-2">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Loading..." : "Filter"}
          </button>
        </div>
      </form>

      {/* Day Book Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Date</th>
                  <th>Voucher Type</th>
                  <th>Voucher No.</th>
                  <th>Party Name</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 ? (
                  list.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.voucherType}</td>
                      <td>{item.voucherNumber}</td>
                      <td>{item.partyName}</td>
                      <td className="text-end">
                        {parseFloat(item.amount || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-3">
                      No records found
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

export default DayBookPage;