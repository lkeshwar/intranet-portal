import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../main.css";

const Login = () => {
  const { login } = useContext(AuthContext); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear old tokens without redirecting
    localStorage.removeItem("token");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await login(username, password);  // FIXED

      if (token) {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-card">
        <h2 className="page-title">Corporate Intranet</h2>
        <p className="page-subtitle">Sign in to access your dashboard</p>

        <form onSubmit={handleSubmit}>
          <label>Username or Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
