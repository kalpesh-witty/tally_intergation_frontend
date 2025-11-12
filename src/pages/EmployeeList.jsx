import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function EmployeeList() {
  const [lits, setList] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const loadGroups = () => {
    axios.get(`${apiUrl}/employees`)
      .then(res => setList(res.data.employees))
      .catch(err => console.error("Failed to load employees", err));
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
      const res = await axios.post(`${apiUrl}/delete-employee`, { name });
      alert(res.data?.message || "Employees deleted successfully!");
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to delete Employees");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h2>Employee List</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Employee Name</th>
            <th>Under</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lits?.length > 0 ? (
            lits.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
                <td>{l?.parent}</td>
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

export default EmployeeList;
