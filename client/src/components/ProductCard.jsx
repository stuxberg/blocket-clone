import { useState } from "react";
import "../css/ProductCard.css";

function ProductCard({ product }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
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
        <p className="product-price">{product.price}</p>
        <p className="product-location">{product.location}</p>
      </div>
    </div>
  );
}

export default ProductCard;
