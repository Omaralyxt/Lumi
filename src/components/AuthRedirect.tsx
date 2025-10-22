import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect = () => {
  const token = localStorage.getItem("lumi_token");
  const profileString = localStorage.getItem("lumi_profile");

  if (!token) {
    // If not logged in, go to user type selection (or login page)
    return <Navigate to="/user-type" replace />;
  }

  if (profileString) {
    try {
      const profile = JSON.parse(profileString);
      if (profile.user_type === 'seller') {
        // Redirect seller to dashboard
        return <Navigate to="/seller/dashboard" replace />;
      }
      // Buyer or Admin defaults to /home
      return <Navigate to="/home" replace />;
    } catch (e) {
      console.error("Failed to parse profile:", e);
      // If profile is corrupted, redirect to home (or force logout/login)
      return <Navigate to="/home" replace />;
    }
  }
  
  // If token exists but no profile, default to home
  return <Navigate to="/home" replace />;
};

export default AuthRedirect;