import React, { useEffect } from "react";
import { useAppSelector } from "./hooks";
import { useState } from "react";
import { Navigate } from "react-router-dom";
interface ReverseProtectedRouteProps {
  element: JSX.Element
}

const ReverseProtectedRoute: React.FC<ReverseProtectedRouteProps> = ({element}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const user = useAppSelector((state)=>state.user);
  useEffect(()=>{
    if(user.githubHandle!==null) setIsAuthenticated(true);
    else setIsAuthenticated(false);
  },[user]);
  if(isAuthenticated === null) return <div>Loading...</div>

  return isAuthenticated ? <Navigate to='/account'/> : element
}

export default ReverseProtectedRoute;