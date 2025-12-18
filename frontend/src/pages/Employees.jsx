import React, { useEffect, useState, useContext } from "react";
import api from "../api/api.js";
import Modal from "../components/Modal";
import { AuthContext } from "../contexts/AuthContext";

console.log("DEBUG → stored email:", localStorage.getItem("userEmail"));


function EmployeeForm({ initial = {}, onSave }) {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    department: "",
    password: "",
    ...initial
  });

  useEffect(() => {
    setForm({ ...form, ...initial });
    // eslint-disable-next-line
  }, [initial]);

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="form-group">
        <label>Username</label>
        <input
          className="input-field"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Name</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          className="input-field"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Department</label>
        <input
          className="input-field"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          className="input-field"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}

export default function Employees() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { isAdmin } = useContext(AuthContext);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/employees");
      setList(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const save = async (payload) => {
    if (!isAdmin) return;

    if (payload.id) {
      await api.put(`/api/employees/${payload.id}`, payload);
    } else {
      await api.post("/api/employees", payload);
    }

    setOpen(false);
    setEditing(null);
    fetchEmployees();
  };

  const remove = async (id) => {
    if (!isAdmin) return;

    if (!window.confirm("Delete employee?")) return;
    await api.delete(`/api/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div className="page-container">
      <h2 className="page-heading">Employee Directory</h2>

      {/* Add Employee button only for admin */}
      {isAdmin && (
        <div style={{ marginBottom: 20 }}>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + Add Employee
          </button>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {list.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.username}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>

                  {isAdmin && (
                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setEditing(emp);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-danger"
                        onClick={() => remove(emp.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isAdmin && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <EmployeeForm initial={editing || {}} onSave={save} />
        </Modal>
      )}
    </div>
  );
}
