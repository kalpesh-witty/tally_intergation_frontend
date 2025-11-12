import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load existing groups
  const loadGroups = () => {
    axios
      .get(`${apiUrl}/groups`)
      .then((res) => setGroups(res.data.groups || []))
      .catch((err) => console.error("Failed to load groups", err));
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Create group
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGroup.trim()) {
      alert("Please enter a group name");
      return;
    }

    const confirmCreate = window.confirm(`Create new group "${newGroup}"?`);
    if (!confirmCreate) return;

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/create-group`, {
        name: newGroup.trim(),
        parent: "Primary",
      });
      alert(res.data?.message || "Group created successfully!");
      setNewGroup("");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  // Delete group
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-group`, { name });
      alert(res.data?.message || "Group deleted successfully!");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to delete group");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary fw-bold">Group Management</h3>

      {/* Create Group Form */}
      <form
        onSubmit={handleCreate}
        className="mb-4 p-3 border rounded bg-light shadow-sm"
      >
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Group Name"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Group List Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th>Group Name</th>
              <th style={{ width: "15%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups?.length > 0 ? (
              groups.map((g, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{g}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(g)}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Deleting...
                        </span>
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

export default GroupList;