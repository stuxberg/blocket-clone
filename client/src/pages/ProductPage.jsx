import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/ProductPage.css";
import { getListing } from "../services/listingAPI";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // TODO: Fetch product from API
    // For now, using dummy data
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        console.log(data);
        setProduct(data);
      } catch (error) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="error">Product not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/">{product.category.name}</a>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        {/* Image Carousel */}
        <div className="image-carousel">
          {product.images && product.images.length > 0 && (
            <>
              <button className="carousel-btn prev" onClick={prevImage}>
                ‹
              </button>
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="carousel-image"
              />
              <button className="carousel-btn next" onClick={nextImage}>
                ›
              </button>
              <div className="image-counter">
                ({currentImageIndex + 1}/{product.images.length})
              </div>
            </>
          )}
        </div>

        {/* Product Details */}
        <div className="product-content">
          <div className="product-main">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">{product.price} kr</div>

            <div className="product-description">
              <h2>Beskrivning</h2>
              <p>{product.description}</p>
            </div>

            <div className="product-location">
              <h3>Plats</h3>
              <p>{product.location.city || product.location.postalCode}</p>
            </div>
          </div>

          <div className="product-sidebar">
            <div className="seller-card">
              <h3>Säljare</h3>
              <p className="seller-name">{product.seller.username}</p>
              <button className="contact-btn">Skicka meddelande</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
