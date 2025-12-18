import React, { useEffect, useState } from "react";
import api from "../api/api.js";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/api/public/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">

      <h2 className="page-heading">Dashboard</h2>

      <div className="card">
        <h3 className="card-title">Registered Users</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
