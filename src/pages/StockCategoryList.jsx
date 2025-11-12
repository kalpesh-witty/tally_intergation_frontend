import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function StockCategoryList() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all stock categories
  const loadCategories = () => {
    axios
      .get(`${apiUrl}/stock-categories`)
      .then((res) => setList(res.data.stockCategories || []))
      .catch((err) => console.error("Failed to load stock categories", err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle create
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter Stock Category Name");
      return;
    }

    if (!window.confirm(`Create new stock category "${name}"?`)) return;
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/create-stock-category`, { name });
      alert("Stock Category created successfully!");
      setName("");
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to create stock category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Stock Category List</h3>

      {/* Create Stock Category Form */}
      <form
        onSubmit={handleSubmit}
        className="d-flex gap-2 align-items-center mb-4"
      >
        <input
          type="text"
          className="form-control"
          placeholder="Enter Stock Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading} style={{width:"200px"}}>
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* Stock Category Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Stock Category Name</th>
                </tr>
              </thead>
              <tbody>
                {list?.length > 0 ? (
                  list.map((l, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{l?.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-muted py-3">
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

export default StockCategoryList;
