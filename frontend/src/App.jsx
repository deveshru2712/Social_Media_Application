import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./Pages/Auth/Signup/SignUpPage";
import LoginPage from "./Pages/Auth/Login/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import NotificationPage from "./Pages/Notification/NotificationPage";
import ProfilePage from "./Pages/Profile/ProfilePage";

import Sidebar from "./Components/Common/Sidebar";
import RightPanel from "./Components/Common/RightPanel";

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* this sidebar is a common component */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/johndoe" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
};

export default App;
