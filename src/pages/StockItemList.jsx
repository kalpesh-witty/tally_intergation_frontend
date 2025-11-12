import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function StockItemList() {
  const [list, setList] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    baseUnits: "",
    openingBalance: "",
    hsnCode: "",
    gstRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load Stock Items
  const loadStockItems = () => {
    axios
      .get(`${apiUrl}/stock-items`)
      .then((res) => setList(res.data.stockItems || []))
      .catch((err) => console.error("Failed to load stock items", err));
  };

  // Load Units
  const loadUnits = () => {
    axios
      .get(`${apiUrl}/units`)
      .then((res) => setUnits(res.data.units || []))
      .catch((err) => console.error("Failed to load units", err));
  };

  useEffect(() => {
    loadUnits();
    loadStockItems();
  }, []);

  // Handle Form Changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Create Stock Item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter stock item name");

    if (!window.confirm(`Create new stock item "${formData.name}"?`)) return;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-stock-item`, formData);
      alert("Stock item created successfully!");
      setFormData({
        name: "",
        baseUnits: "",
        openingBalance: "",
        hsnCode: "",
        gstRate: "",
      });
      loadStockItems();
    } catch (err) {
      console.error(err);
      alert("Failed to create stock item");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-stock-item`, { name });
      alert(res.data?.message || "Stock item deleted successfully!");
      loadStockItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete stock item");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Stock Item Management</h3>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border rounded bg-light shadow-sm mb-4"
      >
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Stock Item Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="col-md-2">
            <select
              name="baseUnits"
              className="form-select"
              value={formData.baseUnits}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">-- Base Unit --</option>
              {units.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="openingBalance"
              className="form-control"
              placeholder="Opening Qty"
              value={formData.openingBalance}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-2">
            <input
              type="text"
              name="hsnCode"
              className="form-control"
              placeholder="HSN Code"
              value={formData.hsnCode}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="gstRate"
              className="form-control"
              placeholder="GST %"
              value={formData.gstRate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-1">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Saving
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Stock Item Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th>Name</th>
              <th>Under</th>
              <th>Unit</th>
              <th>Opening Qty</th>
              <th>Rate</th>
              <th>GST Applicable</th>
              <th style={{ width: "10%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list?.length > 0 ? (
              list.map((l, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{l?.name}</td>
                  <td>{l?.parent || "-"}</td>
                  <td>{l?.baseUnits || "-"}</td>
                  <td>{l?.openingBalance || "0"}</td>
                  <td>0.00</td>
                  <td>{l?.gstApplicable || "Applicable"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(l?.name)}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                          ></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted py-3">
                  No Stock Items Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockItemList;