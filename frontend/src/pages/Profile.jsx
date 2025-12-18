import React, { useEffect, useState } from "react";
import api from "../api/api.js";

export default function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    (async () => {
      setProfile((await api.get("/api/profile")).data);
    })();
  }, []);

  const save = async () => {
    await api.put("/api/profile", profile);
    alert("Saved");
  };

  return (
    <div className="page-container">
      <h2 className="page-heading">My Profile</h2>

      <div className="card form">
        <div className="form-group">
          <label>Name</label>
          <input
            className="input-field"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            className="input-field"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            className="input-field"
            value={profile.department || ""}
            onChange={(e) =>
              setProfile({ ...profile, department: e.target.value })
            }
          />
        </div>

        <button className="btn-primary" onClick={save}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
