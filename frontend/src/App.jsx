import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Participants from "./pages/Participants";
import Analytics from "./pages/Analytics";
import UserRegister from "./pages/UserRegister";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <div className={`app ${theme}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register/:eventId" element={<Register />} />
          <Route path="/participants/:eventId" element={<Participants />} />
          <Route path="/analytics" element={<Analytics source="test" />} />
          <Route path="/analytics-json" element={<Analytics source="json" />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;