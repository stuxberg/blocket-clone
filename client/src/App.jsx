import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Messages from "./pages/Messages";
import CreateListing from "./pages/CreateListing";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<Home />}></Route>

          <ProtectedRoute>
            <Route path="/my-page" element={<Mypage />}></Route>
            <Route path="/messages" element={<Messages />}></Route>
            <Route path="/create" element={<CreateListing />}></Route>
          </ProtectedRoute>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
