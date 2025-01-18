import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/Auth/Signup/SignUpPage";
import LoginPage from "./Pages/Auth/Login/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import Sidebar from "./Components/Common/Sidebar";
import RightPanel from "./Components/Common/RightPanel";
import NotificationPage from "./Pages/Notification/NotificationPage";
import ProfilePage from "./Pages/Profile/ProfilePage";

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* this sidebar is a common component */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      <RightPanel />
    </div>
  );
};

export default App;
