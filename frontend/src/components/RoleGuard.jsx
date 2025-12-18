import React from "react";

export default function RoleGuard({ roles = [], userRoles = [], children }) {
  const allowed = roles.some(r => userRoles.includes(r));

  if (!allowed) return null;

  return <>{children}</>;
}
