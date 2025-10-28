import React from 'react';
import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
  const token = localStorage.getItem("lumi_token");
  const profileString = localStorage.getItem("lumi_profile");

  if (!token) {
    // If not logged in, redirect to the main browsing page
    return <Navigate to="/home" replace />;
  }

  // If logged in, always redirect to /home (since only buyers remain)
  return <Navigate to="/home" replace />;
};

export default RootRedirect;