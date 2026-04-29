import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import BecomeADriver from "../components/UI/BecomeADriver";
import Partners from "../components/UI/Partners";
import SectionHeader from "../components/UI/SectionHeader";
import "../styles/cars.css";
import { ToggleContext } from "../App";

const fallbackCar = "https://ik.imagekit.io/zusxqcpbw/tr:w-600/hero-img-plain3.png?updatedAt=1694598286615";

export default function Cars() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - Browse Cars";
  }, [setDisplayHeader]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/cars");
        const data = await res.json();
        setCars(data);
        if (data.length > 0) setSelectedCar(data[0]);
      } catch {
        console.error("Failed to load cars");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", ...new Set(cars.map((c) => c.category))];

  const displayed = filter === "All"
    ? cars
    : cars.filter((c) => c.category === filter);

  if (isLoading) {
    return (
      <div>
        <SectionHeader title="OUR FLEET" />
        <div className="cars-loading">
          <i className="fa-solid fa-circle-notch fa-spin"></i>
          <p>Loading fleet...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="OUR FLEET" />

      <section className="cars-page">
        <div className="cars-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`cars-filter-btn ${filter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedCar && (
          <div className="cars-featured">
            <div className="cars-featured-img">
              <img
                src={selectedCar.image || fallbackCar}
                alt={selectedCar.name}
                onError={(e) => { e.target.src = fallbackCar; }}
              />
            </div>
            <div className="cars-featured-info">
              <span className="cars-featured-badge">{selectedCar.category}</span>
              <h1>{selectedCar.name}</h1>
              <p className="cars-featured-desc">{selectedCar.description || "No description available."}</p>
              <div className="cars-featured-meta">
                <p className="cars-featured-price">R{parseInt(selectedCar.dailyRate)}<span>/day</span></p>
                <span className={`cars-status ${selectedCar.status}`}>{selectedCar.status}</span>
              </div>
              {selectedCar.status === "available" && (
                <Link to={`/reserve/${encodeURIComponent(selectedCar.name)}`} className="cars-reserve-btn">
                  Reserve Now <i className="fa-solid fa-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="cars-grid">
          {displayed.map((car) => (
            <div
              key={car.id}
              className={`cars-card ${selectedCar?.id === car.id ? "selected" : ""} ${car.status !== "available" ? "unavailable" : ""}`}
              onClick={() => setSelectedCar(car)}
            >
              <div className="cars-card-img">
                <img
                  src={car.image || fallbackCar}
                  alt={car.name}
                  onError={(e) => { e.target.src = fallbackCar; }}
                />
                <span className="cars-card-category">{car.category}</span>
              </div>
              <div className="cars-card-body">
                <h3>{car.name}</h3>
                <p className="cars-card-price">R{parseInt(car.dailyRate)}<span>/day</span></p>
                <span className={`cars-status ${car.status}`}>{car.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BecomeADriver />
      <Partners />
    </div>
  );
}
