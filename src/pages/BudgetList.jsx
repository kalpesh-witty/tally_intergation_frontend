import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../helper";

function BudgetList() {
  const [lits, setList] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/budgets`)
      .then(res => setList(res.data.budgets))
      .catch(err => console.error("Failed to load budgets", err));
  }, []);

  return (
    <>
      <h2>Budget List</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Budget Name</th>
            <th>Under</th>
          </tr>
        </thead>
        <tbody>
          {lits?.length > 0 ? (
            lits.map((l, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{l?.name}</td>
                <td>{l?.parent}</td>
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

export default BudgetList;
