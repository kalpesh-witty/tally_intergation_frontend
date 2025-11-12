import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function GodownList() {
  const [godowns, setGodowns] = useState([]);
  const [godownName, setGodownName] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Load all Godowns
  const loadGodowns = () => {
    axios
      .get(`${apiUrl}/godowns`)
      .then((res) => setGodowns(res.data.godowns || []))
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
      `Are you sure you want to create godown "${godownName}" under "${parentName || "Primary"}"?`
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

  // 🔹 Handle delete
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
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
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Godown List</h3>

      {/* 🔹 Create Godown Form */}
      <form
        onSubmit={handleSubmit}
        className="row g-2 align-items-center mb-4"
      >
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Godown Name"
            value={godownName}
            onChange={(e) => setGodownName(e.target.value)}
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
            {loading ? "Creating..." : "Create Godown"}
          </button>
        </div>
      </form>

      {/* 🔹 Godown Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Godown Name</th>
                  <th>Under</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {godowns?.length > 0 ? (
                  godowns.map((g, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{g?.name}</td>
                      <td>{g?.parent || "Primary"}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(g?.name)}
                          className="btn btn-sm btn-danger"
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
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

export default GodownList;