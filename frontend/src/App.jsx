import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const SignUpPage = React.lazy(() => import("./Pages/Auth/SignUp/SignUpPage"));
const LoginPage = React.lazy(() => import("./Pages/Auth/Login/LoginPage"));
const HomePage = React.lazy(() => import("./Pages/Home/HomePage"));
const NotificationPage = React.lazy(() =>
  import("./Pages/Notification/NotificationPage")
);
const ProfilePage = React.lazy(() => import("./Pages/Profile/ProfilePage"));

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
        // console.log("authUser is here:", data);
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
          element={
            authUser ? (
              <Suspense fallback={<LoadingSpinner />}>
                <HomePage />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !authUser ? (
              <Suspense fallback={<LoadingSpinner />}>
                <LoginPage />
              </Suspense>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !authUser ? (
              <Suspense fallback={<LoadingSpinner />}>
                <SignUpPage />{" "}
              </Suspense>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            authUser ? (
              <Suspense fallback={<LoadingSpinner />}>
                <NotificationPage />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/profile/:username"
          element={
            authUser ? (
              <Suspense fallback={<LoadingSpinner />}>
                <ProfilePage />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      {authUser && <RightPanel />}

      <Toaster />
    </div>
  );
};

export default App;
