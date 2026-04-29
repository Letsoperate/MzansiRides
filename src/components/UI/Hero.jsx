import "../../styles/hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="constant-margin">
      <div className="hero-content">
        <h1 className="hero-title sec-font2 pri-font-clr">
          DRIVE MZANSI IN <span className="sec-font2">STYLE</span>
        </h1>
        <p className="hero-subtitle min-font sec-font-clr">
          Trusted rentals for city commutes, business trips, and weekend escapes
          across South Africa.
        </p>
        <div className="hero-btn-container flex-plain">
          <Link
            to="/cars/All"
            style={{ textDecoration: "none" }}
            className="hero-btn min-font pri-font-clr"
            data-aos="fade-up"
          >
            Book A Ride <i className="fa-solid fa-car-side transition"></i>
          </Link>
          <Link
            to="/about"
            style={{ textDecoration: "none" }}
            className="hero-btn min-font pri-font-clr"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Why MzansiRides <i className="fa-solid fa-angles-right transition"></i>
          </Link>
        </div>
      </div>
      <picture>
        <source
          media="(max-width: 1000px)"
          srcSet="https://ik.imagekit.io/zusxqcpbw/tr:w-600/heroMobile-img3.jpg?updatedAt=1694598394593"
        />
        <img
          loading="lazy"
          className="hero-img"
          src="https://ik.imagekit.io/zusxqcpbw/tr:w-1600/hero-img2.jpg?updatedAt=1694598115983"
          alt="hero car image"
        />
      </picture>
      <div className="hero-overlay"></div>
    </section>
  );
}
