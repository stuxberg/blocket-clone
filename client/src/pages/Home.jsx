import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "../css/Home.css";

function Home() {
  const products = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop",
      title: "Mercedes-Benz GLE",
      price: "579 800 kr",
      location: "Karlskrona",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      title: "Bortskänkes- kolla på beskrivning",
      price: "1 kr",
      location: "Saltsjö-Boo",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      title: "Mercedes-Benz GLE",
      price: "534 000 kr",
      location: "Upplands Väsby",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=300&fit=crop",
      title: "Mercedes-Benz AMG",
      price: "349 900 kr",
      location: "Sundsvall",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop",
      title: "Mercedes-Benz GLE",
      price: "494 900 kr",
      location: "Malmö",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=400&h=300&fit=crop",
      title: "Mercedes-Benz GLE",
      price: "504 500 kr",
      location: "Hörby",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1610736969780-d3edc3c0c3e8?w=400&h=300&fit=crop",
      title: "Mercedes-Benz GLE",
      price: "555 000 kr",
      location: "Stockholm",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=300&fit=crop",
      title: "Mercedes-Benz GLE",
      price: "749 900 kr",
      location: "Norsborg",
    },
  ];

  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Sök efter produkt eller annons-ID"
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>

        <div className="products-section">
          <h2 className="section-title">Rekommenderas för dig</h2>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
