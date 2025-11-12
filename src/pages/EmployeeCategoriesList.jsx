import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function EmployeeCategoriesList() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Load Employee Categories
  const loadCategories = () => {
    axios
      .get(`${apiUrl}/employee-categories`)
      .then((res) => setCategories(res.data.employeeCategories || []))
      .catch((err) =>
        console.error("Failed to load Employee Categories", err)
      );
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 🔹 Create New Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter an Employee Category name");
      return;
    }

    const confirmCreate = window.confirm(
      `Create Employee Category "${name}" under "${parentName || "Primary"}"?`
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

  // 🔹 Delete Category
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-employee-category`, {
        name,
      });
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
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Employee Category List</h3>

      {/* 🔹 Create Form */}
      <form onSubmit={handleSubmit} className="row g-2 align-items-center mb-4">
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Employee Category Name"
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
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>

      {/* 🔹 Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Name</th>
                  <th>Under</th>
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.length > 0 ? (
                  categories.map((cat, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{cat?.name}</td>
                      <td>{cat?.parentName || "Primary"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(cat?.name)}
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
                      No Employee Categories Found
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

export default EmployeeCategoriesList;