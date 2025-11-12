import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function UnitList() {
  const [units, setUnits] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch Units
  const loadUnits = () => {
    axios
      .get(`${apiUrl}/units`)
      .then((res) => setUnits(res.data.units))
      .catch((err) => console.error("Failed to load units", err));
  };

  useEffect(() => {
    loadUnits();
  }, []);

  // Create Unit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a unit name");
      return;
    }

    if (!window.confirm(`Create new unit "${name}"?`)) return;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-unit`, { name });
      alert("Unit created successfully!");
      setName("");
      loadUnits();
    } catch (err) {
      console.error(err);
      alert("Failed to create unit");
    } finally {
      setLoading(false);
    }
  };

  // Delete Unit
  const handleDelete = async (unitName) => {
    if (!window.confirm(`Delete unit "${unitName}"?`)) return;

    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-unit`, { name: unitName });
      alert(res.data?.message || "Unit deleted successfully!");
      loadUnits();
    } catch (err) {
      console.error(err);
      alert("Failed to delete unit");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary fw-bold mb-4">Unit Management</h3>

      {/* Create Unit Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 mb-4 border rounded bg-light shadow-sm"
      >
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Unit Name (e.g., Nos, Kg)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="col-md-3">
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
                  Creating...
                </>
              ) : (
                "Create Unit"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Units Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th>Unit Name</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units?.length > 0 ? (
              units.map((u, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{u}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u)}
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
                <td colSpan="3" className="text-center text-muted py-3">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UnitList;