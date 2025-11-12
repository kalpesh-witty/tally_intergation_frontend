import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function StockGroupList() {
  const [lits, setList] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/stock-groups`)
      .then(res => setList(res.data.stockGroups))
      .catch(err => console.error("Failed to load stock-groups", err));
  }, []);

  return (
    <>
      <h2>Stock Group List</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Stock Group Name</th>
          </tr>
        </thead>
        <tbody>
          {lits?.length > 0 ? (
            lits.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
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

export default StockGroupList;
