import React, { useEffect, useState, useContext } from "react";
import api from "../api/api.js";
import { AuthContext } from "../contexts/AuthContext";

export default function Leaves() {
  const { isAdmin } = useContext(AuthContext);

  const [list, setList] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [showHolidays, setShowHolidays] = useState(false);

  const [form, setForm] = useState({
    from: "",
    to: "",
    reason: "",
    holidayDate: "",
    holidayName: "",
  });

  const fetchData = async () => {
    try {
      const leaveRes = await api.get("/api/leaves");
      setList(leaveRes.data);

      try {
        const holidayRes = await api.get("/api/holidays");
        setHolidays(holidayRes.data);
      } catch {
        setHolidays([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Apply leave
  const apply = async () => {
    const email = localStorage.getItem("userEmail");

    await api.post("/api/leaves", {
      from: form.from,
      to: form.to,
      reason: form.reason,
      username: email,
    });

    setForm({
      ...form,
      from: "",
      to: "",
      reason: "",
    });

    fetchData();
  };

  // ✅ Approve / Reject leave
  const updateStatus = async (id, status) => {
    const email = localStorage.getItem("userEmail");

    if (status === "APPROVED") {
      await api.put(`/api/leaves/${id}/approve`, {}, {
        headers: { "x-user-email": email },
      });
    }

    if (status === "REJECTED") {
      await api.put(`/api/leaves/${id}/reject`, {}, {
        headers: { "x-user-email": email },
      });
    }

    fetchData();
  };

  // ✅ Add holiday (admin only)
  const addHoliday = async () => {
    if (!form.holidayDate || !form.holidayName) return;

    await api.post("/api/holidays", {
      date: form.holidayDate,
      name: form.holidayName,
    });

    setForm({
      ...form,
      holidayDate: "",
      holidayName: "",
    });

    fetchData();
  };

  return (
    <div className="page-container">
      <h2 className="page-heading">Leave Management</h2>

      {/* Apply Leave */}
      <div className="card form" style={{ maxWidth: "420px" }}>
        <div className="form-group">
          <label>From</label>
          <input
            type="date"
            className="input-field"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>To</label>
          <input
            type="date"
            className="input-field"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Reason</label>
          <input
            className="input-field"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>

        <button className="btn-primary" onClick={apply}>
          Apply Leave
        </button>
      </div>

      {/* Leave List */}
      <h3 className="section-heading">Leave Requests</h3>
      <div className="card">
        <ul className="file-list">
          {list.map((l) => (
            <li key={l.id} className="file-item" style={{ marginBottom: "10px" }}>
              <div>
                <b>{l.username}</b> — {l.from} to {l.to}
              </div>

              <div>
                Status:{" "}
                <b
                  style={{
                    color:
                      l.status === "APPROVED"
                        ? "green"
                        : l.status === "REJECTED"
                        ? "red"
                        : "#e67e22",
                  }}
                >
                  {l.status}
                </b>
              </div>

              {/* ✅ Admin buttons */}
              {isAdmin && l.status === "PENDING" && (
                <div style={{ marginTop: "6px" }}>
                  <button
                    className="btn-secondary"
                    style={{ marginRight: "10px" }}
                    onClick={() => updateStatus(l.id, "APPROVED")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => updateStatus(l.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Holidays Section */}
      <div style={{ marginTop: "20px" }}>
        <button
          className="btn-secondary"
          onClick={() => setShowHolidays(!showHolidays)}
        >
          {showHolidays ? "Hide Holidays" : "View Holidays"}
        </button>

        {showHolidays && (
          <div className="card" style={{ padding: "12px", marginTop: "10px" }}>
            <h4>🎉 Holiday List</h4>

            {/* ✅ Admin: Add Holiday Form */}
            {isAdmin && (
              <div className="form" style={{ marginBottom: "15px" }}>
                <h5>Add Holiday</h5>

                <input
                  type="date"
                  className="input-field"
                  value={form.holidayDate}
                  onChange={(e) =>
                    setForm({ ...form, holidayDate: e.target.value })
                  }
                  style={{ marginBottom: "8px" }}
                />

                <input
                  type="text"
                  placeholder="Holiday Name"
                  className="input-field"
                  value={form.holidayName}
                  onChange={(e) =>
                    setForm({ ...form, holidayName: e.target.value })
                  }
                  style={{ marginBottom: "8px" }}
                />

                <button className="btn-primary" onClick={addHoliday}>
                  Add Holiday
                </button>
              </div>
            )}

            {/* Holiday List */}
            {holidays.length === 0 ? (
              <p>No holidays added</p>
            ) : (
              <ul>
                {holidays.map((h) => (
                  <li key={h.id}>
                    {h.date} - {h.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
