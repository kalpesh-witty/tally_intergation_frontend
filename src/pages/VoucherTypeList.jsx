import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function VoucherTypeList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch voucher types
  const loadVoucherTypes = () => {
    setLoading(true);
    axios
      .get(`${apiUrl}/voucher-types`)
      .then((res) => setList(res.data.voucherTypes || []))
      .catch((err) => console.error("Failed to load voucher types", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVoucherTypes();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-4">Voucher Type List</h3>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th>Voucher Type Name</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <div className="mt-2 text-muted">Loading...</div>
                    </td>
                  </tr>
                ) : list?.length > 0 ? (
                  list.map((l, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{l?.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-muted py-3">
                      No Voucher Types Found
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

export default VoucherTypeList;