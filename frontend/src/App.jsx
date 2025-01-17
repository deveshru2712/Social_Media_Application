import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/Auth/Signup/SignUpPage";
import LoginPage from "./Pages/Auth/Login/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import Sidebar from "./Components/Common/Sidebar";

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* this sidebar is a common component */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
};

export default App;
