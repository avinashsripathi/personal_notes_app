import React from "react"; //  Required in some setups
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; //  Wrap in fragment
}

export default PrivateRoute; 