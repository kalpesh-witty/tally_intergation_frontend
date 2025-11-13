import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function PurchaseFormPage() {
  const [form, setForm] = useState({
    supplier: "",
    date: "",
    voucherNo: "",
    narration: "",
    items: [{ itemName: "", quantity: 1, rate: 0, amount: 0 }],
  });
  const [loading, setLoading] = useState(false);

  // 🧮 Calculate total amount for each item
  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;

    if (field === "quantity" || field === "rate") {
      const qty = parseFloat(items[index].quantity) || 0;
      const rate = parseFloat(items[index].rate) || 0;
      items[index].amount = qty * rate;
    }

    setForm({ ...form, items });
  };

  // ➕ Add new row
  const addItemRow = () => {
    setForm({
      ...form,
      items: [...form.items, { itemName: "", quantity: 1, rate: 0, amount: 0 }],
    });
  };

  // ❌ Remove row
  const removeItemRow = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items });
  };

  // 🧾 Calculate grand total
  const totalAmount = form.items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // 📨 Submit Purchase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier || !form.date || !form.voucherNo) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-purchase`, form);
      alert("Purchase voucher created successfully!");
      setForm({
        supplier: "",
        date: "",
        voucherNo: "",
        narration: "",
        items: [{ itemName: "", quantity: 1, rate: 0, amount: 0 }],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create purchase voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Create Purchase Voucher</h3>

      <form onSubmit={handleSubmit} className="card shadow-sm p-4">
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Supplier Name *</label>
            <input
              type="text"
              className="form-control"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Date *</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Voucher No *</label>
            <input
              type="text"
              className="form-control"
              value={form.voucherNo}
              onChange={(e) => setForm({ ...form, voucherNo: e.target.value })}
              required
            />
          </div>
        </div>

        <h5 className="mt-3 mb-2 fw-semibold text-secondary">
          Item Details
        </h5>

        <div className="table-responsive mb-3">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "30%" }}>Item Name</th>
                <th style={{ width: "15%" }}>Quantity</th>
                <th style={{ width: "15%" }}>Rate</th>
                <th style={{ width: "20%" }}>Amount</th>
                <th style={{ width: "10%" }}></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(idx, "itemName", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      min="0"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(idx, "rate", e.target.value)
                      }
                      min="0"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.amount}
                      readOnly
                    />
                  </td>
                  <td>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItemRow(idx)}
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={addItemRow}
        >
          + Add Item
        </button>

        <div className="mb-3">
          <label className="form-label fw-semibold">Narration</label>
          <textarea
            className="form-control"
            rows="3"
            value={form.narration}
            onChange={(e) => setForm({ ...form, narration: e.target.value })}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold">
            Total: ₹ {totalAmount.toFixed(2)}
          </h5>
          <button
            type="submit"
            className="btn btn-success px-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PurchaseFormPage;
