import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Messages from "./pages/Messages";
import CreateListing from "./pages/CreateListing";
import ProductPage from "./pages/ProductPage";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Favorites from "./pages/Favorites";
import MyItems from "./pages/MyItems";
import MyAccount from "./pages/MyAccount";
import { SocketProvider } from "./context/SocketContext";

// Inner component that uses the auth context
function AppRoutes() {
  const { loading } = useAuthContext();

  // Wait for initial auth check to complete
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/listing/:id" element={<ProductPage />}></Route>

      <Route
        path="/my-page"
        element={
          <ProtectedRoute>
            <Mypage />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateListing />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/my-items"
        element={
          <ProtectedRoute>
            <MyItems />
          </ProtectedRoute>
        }
      ></Route>

      <Route
        path="/my-account"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

// Main App component - provides context
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
