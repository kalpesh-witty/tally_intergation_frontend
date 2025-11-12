import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function GodownList() {
  const [list, setList] = useState([]);
  const [godownName, setGodownName] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Load all Godowns
  const loadGodowns = () => {
    axios
      .get(`${apiUrl}/godowns`)
      .then((res) => setList(res.data.godowns))
      .catch((err) => console.error("Failed to load godowns", err));
  };

  useEffect(() => {
    loadGodowns();
  }, []);

  // 🔹 Create new Godown
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!godownName.trim()) {
      alert("Please enter a Godown name");
      return;
    }

    const confirmCreate = window.confirm(
      `Are you sure you want to create godown "${godownName}"?`
    );
    if (!confirmCreate) return;

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/create-godown`, {
        godownName,
        parentName,
      });

      alert(res.data.message || "Godown created successfully!");
      setGodownName("");
      setParentName("");
      loadGodowns();
    } catch (err) {
      console.error(err);
      alert("Failed to create godown");
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
      const res = await axios.post(`${apiUrl}/delete-godown`, { name });
      alert(res.data?.message || "Godown deleted successfully!");
      loadGodowns();
    } catch (err) {
      console.error(err);
      alert("Failed to delete Godown");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h2>Godown List</h2>
      {/* 🔹 Create Godown Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Godown Name"
          value={godownName}
          onChange={(e) => setGodownName(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Godown"}
        </button>
      </form>

      {/* 🔹 Godown Table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Under</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.length > 0 ? (
            list.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
                <td>{l?.parent || "-"}</td>
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
              <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default GodownList;