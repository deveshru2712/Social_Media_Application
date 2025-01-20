import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./Pages/Auth/Signup/SignUpPage";
import LoginPage from "./Pages/Auth/Login/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import NotificationPage from "./Pages/Notification/NotificationPage";
import ProfilePage from "./Pages/Profile/ProfilePage";

import Sidebar from "./Components/Common/Sidebar";
import RightPanel from "./Components/Common/RightPanel";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./Components/Common/LoadingSpinner";

const App = () => {
  // useQuery is used to get the logged in user info

  // the default behavior of useQuery is to always make the fetch request

  // we have use queryKey so that we can use it later on

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    // i have passed here retry false in order to quickly get over with the loading spinner
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* this sidebar is a common component */}
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <RightPanel />}

      <Toaster />
    </div>
  );
};

export default App;
