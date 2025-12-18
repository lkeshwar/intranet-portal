import React, { useEffect, useState } from "react";
import api from "../api/api.js";

export default function Documents() {
  const [files, setFiles] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  // Fetch all documents
  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/documents", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setList(res.data);
      console.log("Documents fetched:", res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      alert("Failed to load documents: " + (err.response?.data || err.message));
    }
  };

  // Upload multiple files
  const uploadFiles = async () => {
    if (!files.length) return alert("Select file(s) to upload");

    try {
      const fd = new FormData();
      files.forEach((file) => fd.append("files", file)); // ✅ multiple files

      const token = localStorage.getItem("token");
      if (!token) return alert("No JWT token found. Please login.");

      await api.post("/api/documents/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles([]);
      loadDocuments();
      alert("✅ Files uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.response?.data || err.message));
    }
  };

  // Download a file by name
  const downloadFile = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/documents/${filename}/download`, {
        responseType: "blob",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("File not found or access denied");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-heading">Documents</h2>

      {/* Upload Section */}
      <div className="card" style={{ marginBottom: "25px" }}>
        <h3 className="card-title">Upload Files</h3>
        <input
          type="file"
          multiple
          className="input-field"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button className="btn-primary" onClick={uploadFiles}>
          📤 Upload Files
        </button>
      </div>

      {/* Document List */}
      <div className="card">
        <h3 className="card-title">Available Documents</h3>
        {list.length === 0 ? (
          <p>No documents available</p>
        ) : (
          <ul className="file-list">
            {list.map((filename) => (
              <li key={filename} className="file-item">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadFile(filename);
                  }}
                >
                  📄 {filename}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
