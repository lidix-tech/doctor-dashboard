import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider.jsx";

function ProtectedRoute({ children }) {
  const { loggedIn, authChecking } = useContext(AuthContext);

  if (authChecking) {
    return <div>Checking authentication...</div>;
  }

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

//THIS FILES ONLY JOB IS TO CHECK WHETER THE USER CAN ACCESS
//A PROTECTED PAGE AND NOTHING ELSE

