import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Load all Employees
  const loadEmployees = () => {
    axios
      .get(`${apiUrl}/employees`)
      .then((res) => setEmployees(res.data.employees || []))
      .catch((err) => console.error("Failed to load employees", err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // 🔹 Create new Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeName.trim()) {
      alert("Please enter Employee Name");
      return;
    }

    const confirmCreate = window.confirm(
      `Create new employee "${employeeName}" under "${parentName || "Primary"}"?`
    );
    if (!confirmCreate) return;

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/create-employee`, {
        employeeName,
        parentName,
      });

      alert(res.data.message || "Employee created successfully!");
      setEmployeeName("");
      setParentName("");
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Employee
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await axios.post(`${apiUrl}/delete-employee`, { name });
      alert(res.data?.message || "Employee deleted successfully!");
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Employee List</h3>

      {/* 🔹 Create Employee Form */}
      {/* <form onSubmit={handleSubmit} className="row g-2 align-items-center mb-4">
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
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
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form> */}

      {/* 🔹 Employee Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Employee Name</th>
                  <th style={{width:"100px"}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees?.length > 0 ? (
                  employees.map((emp, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{emp?.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(emp?.name)}
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
                      No Employees Found
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

export default EmployeeList;