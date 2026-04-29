import { useState, useEffect } from "react";
import "../../styles/hotdeals.css";
import Title from "./Title";
import { Link } from "react-router-dom";

export default function HotDeals() {
  const [hotDeals, setHotDeals] = useState([]);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch("/api/public/cars");
        const data = await res.json();
        const available = data.filter((c) => c.status === "available");
        setHotDeals(available.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch hot deals:", err);
      }
    }
    fetchDeals();
  }, []);

  return (
    <div className="constant-padding constant-margin">
      <Title title="Hot Deals" />
      <div className="cars-container">
        {hotDeals.map((car) => (
          <div key={car.id} className="car-box shadow" data-aos="fade-up" data-aos-duration="500">
            <img
              loading="lazy"
              src={car.image}
              alt={car.name}
              className="car-img transition sub-header-margin"
              onError={(e) => { e.target.src = "https://ik.imagekit.io/zusxqcpbw/tr:w-600/hero-img-plain3.png?updatedAt=1694598286615"; }}
            />
            <h2 className="standard-fz car-name pri-font-clr header-margin">{car.name}</h2>
            <div className="flex-main sub-header-margin">
              <p className="min-font pri-font-clr standard-weight">
                <i className="fa-solid fa-money-bill sec-font-clr2"></i> R{parseInt(car.dailyRate)}/day
              </p>
              <p className="min-font pri-font-clr standard-weight" style={{ textTransform: "capitalize" }}>
                <i className="fa-solid fa-tag sec-font-clr2"></i> {car.category}
              </p>
            </div>
            <div className="flex-main sub-header-margin">
              <p className="min-font pri-font-clr sec-font-clr standard-weight" style={{ textTransform: "capitalize" }}>
                <i className="fa-solid fa-circle-info sec-font-clr2"></i> {car.status}
              </p>
            </div>
            <div className="flex-main deals-btn-container">
              <Link
                to={`/reserve/${encodeURIComponent(car.name)}`}
                style={{ textDecoration: "none" }}
                className="sec-font-clr min-font transition sec-font"
              >
                Reserve Now
              </Link>
            </div>
          </div>
        ))}
        {hotDeals.length === 0 && (
          <p className="min-font sec-font-clr align" style={{ gridColumn: "1/-1" }}>
            No vehicles available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
