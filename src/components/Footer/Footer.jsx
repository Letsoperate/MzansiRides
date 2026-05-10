
import "../../styles/footer.css";
import logoWhite from "../../assets/images/logos/logoWhite.png";
import { Link, NavLink } from "react-router-dom";
import playStoreImg from "../../assets/images/Download-Links/play-store.png";
import appStoreImg from "../../assets/images/Download-Links/app-store.png";
import NewsletterForm from "../UI/NewsletterForm";

export default function Footer() {
  const date = new Date();
  return (
    <footer data-aos="fade" data-aos-delay= "600" className="constant-padding">
      <div>
        <div className="header-margin">
          <Link to="/home">
            <img loading="lazy" className="logo" src={logoWhite} alt="logo" />
          </Link>
        </div>
        <div className="download-links-img">
          <p className="standard-fz sec-font-clr sub-header-margin">
            We Are Available On Mobile
          </p>
          <div className="img-wrapper">
            <button>
              <img
                loading="lazy"
                className="scale transition"
                src={playStoreImg}
                alt="play store"
                effect="blur"
              />
            </button>
            <button>
              <img
                loading="lazy"
                className="scale transition"
                src={appStoreImg}
                alt="app store"
                effect="blur"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex nav-wrapper">
        <nav className="footer-nav">
          <ul className="flex-main flex">
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/home"
              >
                <p className="sec-font standard-fz">Home</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/about"
              >
                <p className="sec-font standard-fz">About</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/cars/All"
              >
                <p className="sec-font standard-fz">Browse Cars</p>
              </NavLink>
            </li>
          </ul>
        </nav>
        <nav className="footer-nav">
          <ul className="flex-main flex">
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/blogs"
              >
                <p className="sec-font standard-fz">Blogs</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/about"
              >
                <p className="sec-font standard-fz">Our Team</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/FAQS"
              >
                <p className="sec-font standard-fz">FAQs</p>
              </NavLink>
            </li>
          </ul>
        </nav>
        <nav className="footer-nav">
          <ul className="flex-main flex">
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/contact"
              >
                <p className="sec-font standard-fz">Contact</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/become-a-driver"
              >
                <p className="sec-font standard-fz">Become A Driver</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to="/privacy-policy"
              >
                <p className="sec-font standard-fz">Privacy Policy</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div className="sub-header-margin">
          <h2
            style={{ marginBottom: ".3em" }}
            className="sec-font3 standard-fz2"
          >
            Newsletter
          </h2>
          <p className="min-font sec-font-clr">
            Subscribe for MzansiRides updates, specials, and travel tips.
          </p>
        </div>
        <div className="header-margin">
          <NewsletterForm />
        </div>
        <div className="links sub-header-margin">
          <a
            style={{ textDecoration: "none" }}
            className="social-handle scale transition"
            href="https://www.facebook.com/mzansirides"
          >
            <i className="fa-brands fa-facebook-f pri-bg standard-fz"></i>
          </a>
          <a
            style={{ textDecoration: "none" }}
            className="social-handle scale transition"
            href="https://www.linkedin.com/company/mzansirides"
          >
            <i className="fa-brands fa-linkedin-in pri-bg standard-fz"></i>
          </a>
          <a
            style={{ textDecoration: "none" }}
            className="social-handle scale transition"
            href="https://x.com/mzansirides"
          >
            <i className="fa-brands fa-x-twitter pri-bg standard-fz"></i>
          </a>
          <a
            style={{ textDecoration: "none" }}
            className="social-handle scale transition"
            href="https://www.instagram.com/mzansirides"
          >
            <i className="fa-brands fa-instagram pri-bg standard-fz"></i>
          </a>
        </div>
        <div className="location">
          <p className="min-font sec-font-clr standard-weight" style={{marginBottom: "0.3em"}}>
            <i className="fa-solid fa-location-dot sec-font-clr"></i>{" "}
            Emalahleni (Witbank), Mpumalanga
          </p>
          <p className="min-font sec-font-clr standard-weight">
            <i className="fa-solid fa-copyright sec-font-clr standard-fz"></i>{" "}
            {date.getFullYear()}, MzansiRides, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
