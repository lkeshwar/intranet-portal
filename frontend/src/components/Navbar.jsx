import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const loc = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Employees", path: "/employees" },
    { name: "Announcements", path: "/announcements" },
    { name: "Leaves", path: "/leaves" },
    { name: "Attendance", path: "/attendance" },
    { name: "Documents", path: "/documents" },
    { name: "Profile", path: "/profile" }
  ];

  return (
    <div className="sidebar">
      <h2>Intranet</h2>

      {menu.map((m) => (
        <Link
          key={m.path}
          to={m.path}
          className={loc.pathname === m.path ? "active" : ""}
        >
          {m.name}
        </Link>
      ))}
    </div>
  );
}
