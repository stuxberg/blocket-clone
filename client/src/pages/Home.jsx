import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAuth } from "../services/api";
const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const isAuth = async () => {
      try {
        setLoading(true);
        const data = await checkAuth();

        if (data.authenticated) {
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        setError("Auth check failed");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    isAuth();
  }, [navigate]);
  return <div>Home</div>;
};

export default Home;
