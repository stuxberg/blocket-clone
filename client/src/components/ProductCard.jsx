import { useState } from "react";
import "../css/ProductCard.css";
import { useEffect } from "react";
import { addFavorite, removeFavorite } from "../services/listingAPI";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, onFavoriteChange }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorited(product.isFavorited);
  }, [product.isFavorited]);

  // Reset favorite state when user logs out
  useEffect(() => {
    if (!user) {
      setIsFavorited(false);
    }
  }, [user]);

  const handleFavorite = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event from bubbling to Link

    // Check if logged in
    if (!user) {
      navigate("/login");
      return;
    }
    const previousState = isFavorited;
    setIsFavorited(!isFavorited);
    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(product._id);
        onFavoriteChange?.(product._id, false);
      } else {
        await addFavorite(product._id);
        onFavoriteChange?.(product._id, true);
      }
    } catch (error) {
      setIsFavorited(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={
            product.images?.[0] ||
            product.image ||
            "https://via.placeholder.com/400x300"
          }
          alt={product.title}
          className="product-image"
        />
        <button
          className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
          onClick={handleFavorite}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">
          {typeof product.price === "number"
            ? `${product.price} kr`
            : product.price}
        </p>
        <p className="product-location">
          {product.location?.postalCode || product.location}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
