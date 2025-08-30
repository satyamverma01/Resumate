import React from "react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import { Signup } from "./auth/Signup";
import { ErrorPage } from "./components/ErrorPage";
import LandingPage from "./components/LandingPage";
import ResumeFile from "./components/ResumeFile";

function App() {
  const token = localStorage.getItem("token");
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route
          path="/resume"
          element={token ? <ResumeFile /> : <Navigate to={"/login"} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
