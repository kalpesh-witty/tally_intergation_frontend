import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function StockItemList() {
  const [list, setList] = useState([]);
  const [unit, setUnit] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    baseUnits: "",
    openingBalance: "",
    hsnCode: "",
    gstRate: ""
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch stock items
  const loadStockItems = () => {
    axios.get(`${apiUrl}/stock-items`)
      .then(res => setList(res.data.stockItems))
      .catch(err => console.error("Failed to load stock items", err));
  };

  const loadUnits = () => {
    axios.get(`${apiUrl}/units`)
      .then(res => setUnit(res.data.units))
      .catch(err => console.error("Failed to load units", err));
  };

  useEffect(() => {
    loadUnits();
    loadStockItems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit (create new stock item)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter Stock Item Name");
      return;
    }

    const confirmCreate = window.confirm(`Create new stock item "${formData.name}"?`);
    if (!confirmCreate) return;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-stock-item`, formData);
      alert("Stock Item created successfully!");
      setFormData({ name: "", baseUnits: "", openingBalance: "", hsnCode: "", gstRate: "" });
      loadStockItems(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to create stock item");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-stock-item`, { name });
      alert(res.data?.message || "Stock Item deleted successfully!");
      loadStockItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete stock item");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h2>Stock Item List</h2>

      {/* Create Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Stock Item Name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <select
          name="baseUnits"
          value={formData.baseUnits}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">-- Select Base Unit --</option>
          {unit.map((unit, idx) => (
            <option key={idx} value={unit}>{unit}</option>
          ))}
        </select>
        <input
          type="number"
          name="openingBalance"
          placeholder="Opening Balance"
          value={formData.openingBalance}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="text"
          name="hsnCode"
          placeholder="HSN Code"
          value={formData.hsnCode}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="number"
          name="gstRate"
          placeholder="GST % (e.g. 18)"
          value={formData.gstRate}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Stock Item"}
        </button>
      </form>

      {/* Stock Item Table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Stock Item Name</th>
            <th>Under</th>
            <th>Unit</th>
            <th>Opening Qty</th>
            <th>Rate</th>
            <th>GST Applicable</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.length > 0 ? (
            list.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
                <td>{l?.parent}</td>
                <td>{l?.baseUnits}</td>
                <td>{l?.openingBalance}</td>
                <td>0.00</td>
                <td>{l?.gstApplicable}</td>
                <td>
                  <button
                    onClick={() => handleDelete(l?.name)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default StockItemList;
