import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function StockSummaryPage() {
  const [list, setList] = useState([]);
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStock = async () => {
    setLoading(true);
    try {
      const params = {};
      if (item) params.search = item;

      const res = await axios.get(`${apiUrl}/stock-summary`, { params });
      setList(res.data?.stock || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch Stock Summary");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    loadStock();
  };

  useEffect(() => {
    loadStock();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">📦 Stock Summary</h3>

      {/* Filter Section */}
      <form onSubmit={handleFilter} className="row g-2 align-items-end mb-4">
        <div className="col-md-11">
          <label className="form-label fw-semibold">Stock Item</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search item..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-1">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "..." : "Go"}
          </button>
        </div>
      </form>

      {/* Stock Summary Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Unit</th>
                  <th className="text-end">Rate</th>
                  <th className="text-end">Value</th>
                </tr>
              </thead>

              <tbody>
                {list.length > 0 ? (
                  list.map((row, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.qty}</td>
                      <td className="text-end">
                        {parseFloat(row.rate || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-end">
                        {parseFloat(-row.value || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-3">
                      No data found
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

export default StockSummaryPage;