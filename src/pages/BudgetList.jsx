import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function BudgetList() {
  const [list, setList] = useState([]);
  const [groups, setGroups] = useState([]); // For "Under" dropdown
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);

  // Load budgets
  const loadBudgets = () => {
    axios
      .get(`${apiUrl}/budgets`)
      .then((res) => setList(res.data.budgets || []))
      .catch((err) => console.error("Failed to load budgets", err));
  };

  // Load available parent budgets
  const loadGroups = () => {
    axios
      .get(`${apiUrl}/budget-groups`)
      .then((res) => setGroups(res.data.budgetGroups || []))
      .catch((err) => console.error("Failed to load budget groups", err));
  };

  useEffect(() => {
    loadBudgets();
    loadGroups();
  }, []);

  // Create new budget
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter budget name");
      return;
    }

    if (!window.confirm(`Create new budget "${name}" under "${parent || "Primary"}"?`))
      return;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-budget`, {
        name,
        parent: parent || "Primary",
      });
      alert("Budget created successfully!");
      setName("");
      setParent("");
      loadBudgets();
    } catch (err) {
      console.error(err);
      alert("Failed to create budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Budget List</h3>

      {/* Create Budget Form */}
      <form
        onSubmit={handleSubmit}
        className="row g-2 align-items-center mb-4"
      >
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Budget Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {loading ? "Creating..." : "Create Budget"}
          </button>
        </div>
      </form>

      {/* Budget List Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Budget Name</th>
                  <th>Under</th>
                </tr>
              </thead>
              <tbody>
                {list?.length > 0 ? (
                  list.map((l, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{l?.name}</td>
                      <td>{l?.parent || "Primary"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center text-muted py-3"
                    >
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

export default BudgetList;