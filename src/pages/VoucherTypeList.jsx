import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function VoucherTypeList() {
  const [lits, setList] = useState([]);
  // const [deleting, setDeleting] = useState(false);

  const loadVocherType = () => {
    axios.get(`${apiUrl}/voucher-types`)
      .then(res => setList(res.data.voucherTypes))
      .catch(err => console.error("Failed to load voucher-types", err));
  };

  useEffect(() => {
    loadVocherType();
  }, []);

  // Handle delete
  // const handleDelete = async (name) => {
  //   const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
  //   if (!confirmDelete) return;
  //   setDeleting(true);
  //   try {
  //     const res = await axios.post(`${apiUrl}/delete-voucher-type`, { name });
  //     alert(res.data?.message || "Voucher Type deleted successfully!");
  //     loadVocherType();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to delete Voucher Type");
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  return (
    <>
      <h2>Voucher Type List</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Voucher Type Name</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {lits?.length > 0 ? (
            lits.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
                {/* <td>
                  <button
                    onClick={() => handleDelete(l?.name)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default VoucherTypeList;
