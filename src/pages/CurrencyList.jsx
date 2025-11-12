import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function CurrencyList() {
  const [lits, setList] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/currency`)
      .then(res => setList(res.data.currency))
      .catch(err => console.error("Failed to load currency", err));
  }, []);

  return (
    <>
      <h2>Currency List</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Currency Name</th>
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

export default CurrencyList;
