import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import Modal from "../components/Modal";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const fetch = async () =>
    setItems((await api.get("/api/announcements")).data);

  useEffect(() => {
    fetch();
  }, []);

  const save = async () => {
    await api.post("/api/announcements", form);
    setOpen(false);
    setForm({ title: "", body: "" });
    fetch();
  };

  return (
    <div className="page-container">

      <div className="header-row">
        <h2 className="page-heading">Announcements</h2>
        <button className="btn-primary" style={{ width: "180px" }} onClick={() => setOpen(true)}>
          ➕ Add Announcement
        </button>
      </div>

      <div className="card-list">
        {items.map((a) => (
          <div className="card" key={a.id}>

            <h3 className="card-title">{a.title}</h3>

            <p className="card-body-text">{a.body}</p>

            <div className="card-footer">
              <span className="footer-meta">
                📢 Posted by <strong>{a.author}</strong>
              </span>
              <span>{new Date(a.createdAt).toLocaleString()}</span>
            </div>

          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="modal-container">
          <h3 className="modal-title">New Announcement</h3>

          <input
            className="input-field"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            className="input-area"
            placeholder="Write your announcement..."
            value={form.body}
            onChange={(e) =>
              setForm({ ...form, body: e.target.value })
            }
          />

          <button className="btn-primary" onClick={save}>
            Publish Announcement
          </button>
        </div>
      </Modal>

    </div>
  );
}
