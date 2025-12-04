import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../css/CreateListing.css";
import { createListing } from "../services/listingAPI";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [formData, setFormData] = useState({
    images: [],
    category: "",
    title: "",
    description: "",
    price: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await createListing(formData);

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Creating listing failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-listing-page">
        <div className="create-listing-container">
          <h1 className="create-listing-title">Torget</h1>

          <form className="create-listing-form" onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <div className="form-section">
              <label className="form-label">Bilder</label>
              <div className="image-upload-container">
                <button type="button" className="image-upload-btn">
                  <span>Lägg till bilder</span>
                </button>
              </div>
            </div>

            {/* Category Section */}
            <div className="form-section">
              <label className="form-label">
                Huvudkategori
                <span className="form-sublabel">
                  Nu har Blocket ännu fler kategorier
                </span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Välj kategori</option>
                <option value="fordon">Fordon</option>
                <option value="bostad">Bostad</option>
                <option value="hem-tradgard">Hem & Trädgård</option>
                <option value="fritid-hobby">Fritid & Hobby</option>
                <option value="elektronik">Elektronik</option>
                <option value="personligt">Personligt</option>
                <option value="familj">Familj</option>
                <option value="affarsverksamhet">Affärsverksamhet</option>
              </select>
            </div>

            {/* Title Section */}
            <div className="form-section">
              <label className="form-label">Annonsrubrik</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Description Section */}
            <div className="form-section">
              <label className="form-label">Beskrivning</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="6"
              ></textarea>
            </div>

            {/* Price Section */}
            <div className="form-section">
              <label className="form-label">Pris</label>
              <div className="price-input-container">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input price-input"
                />
                <span className="price-currency">kr</span>
              </div>
            </div>

            {/* Location Section */}
            <div className="form-section location-section">
              <h2 className="section-heading">Varifrån säljer du?</h2>
              <label className="form-label">Postnummer</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="form-input postal-input"
                maxLength="5"
              />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button type="button" className="preview-btn">
                Visa förhandsvisning
              </button>
              <button type="submit" className="submit-btn">
                Fortsätt
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateListing;
