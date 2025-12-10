import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyListings } from "../services/listingAPI";
import "../css/MyItems.css";

function MyItems() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyListings();
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    let filtered = listings;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter === "active") {
      filtered = filtered.filter((listing) => listing.status === "active");
    } else if (activeFilter === "draft") {
      filtered = filtered.filter((listing) => listing.status === "draft");
    }

    setFilteredListings(filtered);
  }, [searchQuery, activeFilter, listings]);

  const getDaysRemaining = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = 60 * 24 * 60 * 60 * 1000 - (now - created); // 60 days in ms
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const activeCount = listings.filter((l) => l.status === "active").length;
  const draftCount = listings.filter((l) => l.status === "draft").length;

  return (
    <div className="my-items">
      <Navbar />
      <div className="my-items-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/my-page">Mitt Blocket</Link>
          <span>/</span>
          <span>Mina annonser</span>
        </nav>

        {/* Title */}
        <h1 className="page-title">Mina annonser</h1>

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Sök baserat på annonsinnehåll"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            Alla ({listings.length})
          </button>
          <button
            className={`filter-tab ${activeFilter === "draft" ? "active" : ""}`}
            onClick={() => setActiveFilter("draft")}
          >
            Utkast ({draftCount})
          </button>
          <button
            className={`filter-tab ${
              activeFilter === "active" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("active")}
          >
            Aktiva ({activeCount})
          </button>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">Laddar annonser...</div>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Listings */}
        {!loading && !error && (
          <div className="listings-list">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="listing-card">
                <Link to={`/listing/${listing._id}`} className="listing-link">
                  <div className="listing-image-container">
                    <img
                      src={
                        listing.images?.[0] ||
                        "https://via.placeholder.com/100x100"
                      }
                      alt={listing.title}
                      className="listing-image"
                    />
                  </div>
                  <div className="listing-info">
                    <div className="listing-header">
                      <span className="listing-badge">Aktiv</span>
                      <div className="listing-stats">
                        <span className="stat">
                          <span className="stat-icon">❤️</span>{" "}
                          {listing.favoriteCount || 0}
                        </span>
                      </div>
                    </div>
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-price">
                      Torget säljes {listing.price},-
                    </p>
                    <p className="listing-meta">
                      <span className="separator">•</span>
                      <span className="last-modified">
                        Senast ändrad {listing.updatedAt}
                      </span>
                    </p>
                  </div>
                </Link>
                <div className="listing-actions">
                  <button className="mark-sold-btn">Markera som såld</button>
                </div>
              </div>
            ))}

            {filteredListings.length === 0 && (
              <div className="empty-state">
                <p>Inga annonser hittades</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyItems;
