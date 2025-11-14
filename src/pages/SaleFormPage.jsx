import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function SaleFormPage() {
  const [form, setForm] = useState({
    supplier: "",
    purchaseLedger: "",
    date: "",
    voucherNo: "",
    narration: "",
    items: [{ itemName: "", quantity: 1, rate: 0, amount: 0 }],
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [ledgers, setLedgers] = useState([]);
  const [purchaseLedgers, setPurchaseLedgers] = useState([]);
  const [list, setList] = useState([]);

  const extractRate = (rateString) => {
    if (!rateString) return 0;
    return parseFloat(rateString.split("/")[0]) || 0;
  };

  // 🧮 Calculate total amount for each item
  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;

    // Auto fetch rate when itemName changes
    if (field == "itemName") {
      const alreadyExists = form.items.some(
        (it, i) => it.itemName === value && i !== index
      );
      if (alreadyExists) {
        return; // stop further processing
      }
      const selectedItem = list.find((item) => item.name === value);
      if (selectedItem) {
        items[index].rate = extractRate(selectedItem.openingRate) || 0;
      }
    }

    // Auto Calculate Amount
    const qty = parseFloat(items[index].quantity) || 0;
    const rate = parseFloat(items[index].rate) || 0;
    items[index].amount = qty * rate;

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

    form.total = totalAmount;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/create-sale`, form);
      alert("Sales voucher created successfully!");
      setForm({
        supplier: "",
        purchaseLedger: "",
        date: "",
        voucherNo: "",
        narration: "",
        items: [{ itemName: "", quantity: 1, rate: 0, amount: 0 }],
        total: 0
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create Sales voucher");
    } finally {
      setLoading(false);
    }
  };

  const loadLedgers = () => {
    axios
      .get(`${apiUrl}/ledgers`)
      .then((res) => {
        const filtered = res.data.ledgers.filter(
          (ledger) => ledger.parent === "Sundry Creditors" || ledger.parent === 'Sundry Debtors'
        );
        setLedgers(filtered);
        const purchasefiltered = res.data.ledgers.filter(
          (ledger) => ledger.parent === "Sales Accounts"
        );
        setPurchaseLedgers(purchasefiltered)
      })
      .catch((err) => console.error("Failed to load ledgers", err));
  };

  const loadStockItems = () => {
    axios
      .get(`${apiUrl}/stock-items`)
      .then((res) => setList(res.data.stockItems || []))
      .catch((err) => console.error("Failed to load stock items", err));
  };

  useEffect(() => {
    loadLedgers();
    loadStockItems();
  }, [])

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Create Sale Voucher</h3>

      <form onSubmit={handleSubmit} className="card shadow-sm p-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Sales Order No.*</label>
            <input
              type="text"
              className="form-control"
              value={'Auto Generated Number'}
              disabled
            />
          </div>
          <div className="col-md-8 mb-3"></div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Party A/c Name*</label>
            <select
              className="form-select w-100"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              disabled={loading}
              required
            >
              <option value="">Select Party A/c Name</option>
              {ledgers.map((g, idx) => (
                <option key={idx} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Date *</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Order No*</label>
            <input
              type="text"
              className="form-control"
              value={form.voucherNo}
              onChange={(e) => setForm({ ...form, voucherNo: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Sale Ledger*</label>
            <select
              className="form-select w-100"
              value={form.purchaseLedger}
              onChange={(e) => setForm({ ...form, purchaseLedger: e.target.value })}
              disabled={loading}
              required
            >
              <option value="">Select Sale Ledger</option>
              {purchaseLedgers.map((g, idx) => (
                <option key={idx} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
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
                    <select
                      className="form-select w-100"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                      disabled={loading}
                      required
                    >
                      <option value="" disabled>Select Item</option>
                      {list.map((g, idx) => (
                        <option key={idx} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
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
                      readOnly
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
            {loading ? "Saving..." : "Save Sales"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SaleFormPage;
