import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function EmployeeCategoriesList() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Load all Godowns
  const loadCategories = () => {
    axios
      .get(`${apiUrl}/employee-categories`)
      .then((res) => setList(res.data.employeeCategories))
      .catch((err) => console.error("Failed to load Employee Categories", err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 🔹 Create new Godown
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a Employee Category name");
      return;
    }

    const confirmCreate = window.confirm(
      `Are you sure you want to create Employee Category "${name}"?`
    );
    if (!confirmCreate) return;

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/create-employee-category`, {
        name,
        parentName,
      });

      alert(res.data.message || "Employee Category created successfully!");
      setName("");
      setParentName("");
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to create Employee Category");
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
      const res = await axios.post(`${apiUrl}/delete-employee-category`, { name });
      alert(res.data?.message || "Employee Category deleted successfully!");
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete Employee Category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h2>Employee Category List</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Employee Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Employee Category"}
        </button>
      </form>

      {/* 🔹 Godown Table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.length > 0 ? (
            list.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
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

export default EmployeeCategoriesList;