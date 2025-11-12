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
    axios.get(`${apiUrl}/units`)
      .then(res => setUnits(res.data.units))
      .catch(err => console.error("Failed to load units", err));
  };

  useEffect(() => {
    loadUnits();
  }, []);

  // Create Unit with Confirmation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a unit name");
      return;
    }

    const confirmCreate = window.confirm(`Are you sure you want to create unit "${name}"?`);
    if (!confirmCreate) return;

    setLoading(true);

    try {
      await axios.post(`${apiUrl}/create-unit`, { name });
      alert("Unit created successfully!");
      setName("");
      loadUnits();    // Refresh list after creating
    } catch (err) {
      alert("Failed to create unit");
      console.error(err);
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
      const res = await axios.post(`${apiUrl}/delete-unit`, { name });
      alert(res.data?.message || "Unit deleted successfully!");
      loadUnits();
    } catch (err) {
      console.error(err);
      alert("Failed to delete Unit");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h2>Units List</h2>

      {/* Create Unit Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Unit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Unit"}
        </button>
      </form>

      {/* Units Table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Unit Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {units?.length > 0 ? (
            units.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l}</td>
                <td>
                  <button
                    onClick={() => handleDelete(l)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default UnitList;