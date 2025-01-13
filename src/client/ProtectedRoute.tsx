import React, { useEffect } from "react";
import { useAppSelector } from "./hooks";
import { useState } from "react";
import { Navigate } from "react-router-dom";
interface ProtectedRouteProps {
  element: JSX.Element
  isAuthenticated:Boolean | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({isAuthenticated, element}) => {
  console.log(isAuthenticated);

  if (isAuthenticated === null) {
    // Show a loading state until authentication is determined
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to='/login'/>
}

export default ProtectedRoute;