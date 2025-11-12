import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function GroupList() {
  const [lits, setList] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const loadGroups = () => {
    axios.get(`${apiUrl}/groups`)
      .then(res => setList(res.data.groups))
      .catch(err => console.error("Failed to load groups", err));
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Handle delete
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-group`, { name });
      alert(res.data?.message || "Group deleted successfully!");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to delete Group");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h2>Group List</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Group Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lits?.length > 0 ? (
            lits.map((l, idx) => (
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

export default GroupList;
