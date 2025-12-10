import React from "react";
import { getFavorites } from "../services/listingAPI";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Favorites() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleFavoritesChange = (id, isFavorited) => {
    if (!isFavorited)
      setFavorites((prev) => prev.filter((product) => product._id !== id));
  };

  return (
    <div className="favorites">
      <Navbar />

      <div className="home-container">
        <nav className="breadcrumb">
          <Link to="/my-page">Mitt Blocket</Link>
          <span>/</span>
          <span>Mina annonser</span>
        </nav>
        <div className="products-section">
          <h2 className="section-title">Dina favoritannonser</h2>
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner">Loading products...</div>
            </div>
          )}
          {error && (
            <div className="error-container">
              <div className="error-message">{error}</div>
            </div>
          )}
          {!loading && !error && (
            <div className="products-grid">
              {favorites.map((product) => (
                <Link
                  key={product._id}
                  to={`/listing/${product._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ProductCard
                    product={product}
                    onFavoriteChange={handleFavoritesChange}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
