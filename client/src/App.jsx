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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/my-page" element={<Mypage />}></Route>
        <Route path="/messages" element={<Messages />}></Route>
        <Route path="/create" element={<CreateListing />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
