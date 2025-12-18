function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return null;  
  return token ? children : <Navigate to="/login" replace />;
}
