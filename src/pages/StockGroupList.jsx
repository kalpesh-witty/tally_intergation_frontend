import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function StockGroupList() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Stock Groups
  const loadStockGroups = () => {
    axios
      .get(`${apiUrl}/stock-groups`)
      .then((res) => setGroups(res.data.stockGroups || []))
      .catch((err) => console.error("Failed to load stock groups", err));
  };

  useEffect(() => {
    loadStockGroups();
  }, []);

  // Handle Create
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter stock group name");
      return;
    }

    const confirmCreate = window.confirm(
      `Create new Stock Group "${name}" under "${parent || "Primary"}"?`
    );
    if (!confirmCreate) return;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-stock-group`, {
        name: name.trim(),
        parent: parent || "Primary",
      });
      alert("Stock Group created successfully!");
      setName("");
      setParent("");
      loadStockGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to create stock group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Stock Group List</h3>

      {/* Create Stock Group Form */}
      <form
        onSubmit={handleSubmit}
        className="row g-2 align-items-center mb-4"
      >
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Stock Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>

      {/* Stock Group Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Stock Group Name</th>
                </tr>
              </thead>
              <tbody>
                {groups?.length > 0 ? (
                  groups?.map((g, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{g?.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-3">
                      No Data Found
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

export default StockGroupList;