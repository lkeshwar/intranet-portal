import React, { useEffect, useState } from "react";
import api from "../api/api.js";

export default function Attendance() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await api.get("/api/attendance");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const markPresent = async () => {
    await api.post("/api/attendance/mark");
    fetchHistory();
  };

  return (
    <div className="page-container">

      <div className="header-row">
        <h2 className="page-heading">Attendance</h2>
        <button className="btn-primary" style={{ width: "170px" }} onClick={markPresent}>
          ✔ Mark Present
        </button>
      </div>

      <div className="card">
        <h3 className="card-title">Attendance History</h3>

        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              history.map((h) => (
                <tr key={h.id}>
                  <td>{h.username}</td>
                  <td>{h.date}</td>
                  <td>{h.status}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
