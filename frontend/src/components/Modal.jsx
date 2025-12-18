import React from "react";

export default function Modal({ children, open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999
    }}>
      <div style={{background:"#fff", padding:20, width:640, borderRadius:8}}>
        <button onClick={onClose} style={{float:"right"}}>Close</button>
        {children}
      </div>
    </div>
  );
}
