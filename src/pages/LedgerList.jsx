import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function LedgerList() {
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [ledgerName, setLedgerName] = useState("");
  const [parent, setParent] = useState("");
  const [editLedger, setEditLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load Ledgers
  const loadLedgers = () => {
    axios
      .get(`${apiUrl}/ledgers`)
      .then((res) => setLedgers(res.data.ledgers))
      .catch((err) => console.error("Failed to load ledgers", err));
  };

  // Load Ledger Groups
  const loadGroups = () => {
    axios
      .get(`${apiUrl}/ledger-groups`)
      .then((res) => setGroups(res.data.groups || []))
      .catch((err) => console.error("Failed to load groups", err));
  };

  useEffect(() => {
    loadLedgers();
    loadGroups();
  }, []);

  // Create / Update Ledger
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ledgerName.trim() || !parent.trim()) {
      alert("Please fill all fields");
      return;
    }

    const isEdit = !!editLedger;
    const confirmMsg = isEdit
      ? `Update ledger "${editLedger}" to "${ledgerName}" under "${parent}"?`
      : `Create new ledger "${ledgerName}" under "${parent}"?`;

    if (!window.confirm(confirmMsg)) return;
    setLoading(true);

    try {
      if (isEdit) {
        await axios.post(`${apiUrl}/update-ledger`, {
          oldName: editLedger,
          newName: ledgerName,
          parent,
        });
        alert("Ledger updated successfully!");
      } else {
        await axios.post(`${apiUrl}/create-ledger`, { ledgerName, parent });
        alert("Ledger created successfully!");
      }

      setLedgerName("");
      setParent("");
      setEditLedger(null);
      loadLedgers();
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Failed to update ledger" : "Failed to create ledger");
    } finally {
      setLoading(false);
    }
  };

  // Delete Ledger
  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeleting(true);
    try {
      await axios.post(`${apiUrl}/delete-ledger`, { name });
      alert("Ledger deleted successfully!");
      loadLedgers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete ledger");
    } finally {
      setDeleting(false);
    }
  };

  // Edit Ledger
  const handleEdit = (ledger) => {
    setEditLedger(ledger.name);
    setLedgerName(ledger.name);
    setParent(ledger.parent || "");
  };

  const handleCancelEdit = () => {
    setEditLedger(null);
    setLedgerName("");
    setParent("");
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary fw-bold mb-4">Ledger Management</h3>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 mb-4 border rounded bg-light shadow-sm"
      >
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Ledger Name"
              value={ledgerName}
              onChange={(e) => setLedgerName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">-- Select Ledger Group --</option>
              {groups.map((g, idx) => (
                <option key={idx} value={g.name}>
                  {g.name} {g.parent ? `(${g.parent})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 d-flex gap-2">
            <button
              type="submit"
              className={`btn ${editLedger ? "btn-warning" : "btn-primary"} w-100`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {editLedger ? "Updating..." : "Creating..."}
                </>
              ) : editLedger ? (
                "Update Ledger"
              ) : (
                "Create Ledger"
              )}
            </button>

            {editLedger && (
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Ledger Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th>Ledger Name</th>
              <th>Group</th>
              <th style={{ width: "20%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledgers?.length > 0 ? (
              ledgers.map((l, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{l.name}</td>
                  <td>{l.parent || "-"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(l)}
                        disabled={loading || deleting}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(l.name)}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                            ></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
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
  );
}

export default LedgerList;