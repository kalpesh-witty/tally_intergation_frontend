import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function LedgerList() {
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]); // ← ledger groups list
  const [ledgerName, setLedgerName] = useState("");
  const [parent, setParent] = useState(""); // ← selected group
  const [editLedger, setEditLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch Ledgers
  const loadLedgers = () => {
    axios
      .get(`${apiUrl}/ledgers`)
      .then((res) => setLedgers(res.data.ledgers))
      .catch((err) => console.error("Failed to load ledgers", err));
  };

  // Fetch Groups (Ledger Parents)
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

  // Create or Update Ledger
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ledgerName.trim()) {
      alert("Please enter ledger name");
      return;
    }
    if (!parent.trim()) {
      alert("Please select a ledger group");
      return;
    }

    const isEdit = !!editLedger;
    const confirmMsg = isEdit
      ? `Update ledger "${editLedger}" with name "${ledgerName}" and group "${parent}"?`
      : `Create new ledger "${ledgerName}" under group "${parent}"?`;

    if (!window.confirm(confirmMsg)) return;
    setLoading(true);

    try {
      if (isEdit) {
        // UPDATE API
        await axios.post(`${apiUrl}/update-ledger`, {
          oldName: editLedger,
          newName: ledgerName,
          parent,
        });
        alert("Ledger updated successfully!");
      } else {
        // CREATE API
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
      const res = await axios.post(`${apiUrl}/delete-ledger`, { name });
      alert(res.data?.message || "Ledger deleted successfully!");
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
    <>
      <h2>Ledger List</h2>

      {/* Ledger Create / Edit Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Ledger Name"
          value={ledgerName}
          onChange={(e) => setLedgerName(e.target.value)}
          disabled={loading}
          required
        />

        <select
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          disabled={loading}
          required
          style={{ marginLeft: "10px" }}
        >
          <option value="">-- Select Ledger Group --</option>
          {groups.map((g, idx) => (
            <option key={idx} value={g.name}>
              {g.name} {g.parent ? `(${g.parent})` : ""}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
          {loading
            ? editLedger
              ? "Updating..."
              : "Creating..."
            : editLedger
            ? "Update Ledger"
            : "Create Ledger"}
        </button>

        {editLedger && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Ledger Table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Ledger Name</th>
            <th>Group</th>
            <th>Actions</th>
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
                  <button
                    onClick={() => handleEdit(l)}
                    disabled={loading || deleting}
                  >
                    Edit
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(l.name)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default LedgerList;