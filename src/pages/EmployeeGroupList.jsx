import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function EmployeeGroupList() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Load Employee Groups
  const loadGroups = () => {
    axios
      .get(`${apiUrl}/employee-groups`)
      .then((res) => setGroups(res.data.groups || []))
      .catch((err) => console.error("Failed to load Employee Groups", err));
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // 🔹 Create New Group
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter Employee Group name");
      return;
    }

    const confirmCreate = window.confirm(
      `Create Employee Group "${name}" under "${parentName || "Primary"}"?`
    );
    if (!confirmCreate) return;

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/create-employee-category`, {
        name,
        parentName,
      });

      alert(res.data.message || "Employee Group created successfully!");
      setName("");
      setParentName("");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to create Employee Group");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Group
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-employee-category`, { name });
      alert(res.data?.message || "Employee Group deleted successfully!");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to delete Employee Group");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Employee Group List</h3>

      {/* 🔹 Create Employee Group Form */}
      <form onSubmit={handleSubmit} className="row g-2 align-items-center mb-4">
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Employee Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="col-md-2">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>

      {/* 🔹 Group Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Name</th>
                  <th style={{width:"100px"}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {groups?.length > 0 ? (
                  groups.map((g, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{g?.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(g?.name)}
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
                      No Employee Groups Found
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

export default EmployeeGroupList;
