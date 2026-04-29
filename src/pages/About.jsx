import { useContext,useEffect, } from "react";

import "../styles/about.css";
import playStoreImg from "../../src/assets/images/Download-Links/play-store.png";
import appStoreImg from "../../src/assets/images/Download-Links/app-store.png";
import logoWhite from "../../src/assets/images/logos/logoWhite.png";
import phoneGif from "../../src/assets/images/phone.gif";
import newsletterGif from "../../src/assets/images/newsletter.gif";
import NewsletterForm from "../components/UI/NewsletterForm";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function About() {
  const { setDisplayHeader } = useContext(ToggleContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - About";
  }, []);

  const teamData = [
    {
      id: 1,
      imgSrc:
        "https://ik.imagekit.io/zusxqcpbw/tr:w-400/team1.avif?updatedAt=1694600057681",
      teamName: "Lerato Mokoena",
      teamPosition: "Fleet Operations Lead",
    },
    {
      id: 2,
      imgSrc:
        "https://ik.imagekit.io/zusxqcpbw/tr:w-400/team2.avif?updatedAt=1694600057523",
      teamName: "Siyabonga Khumalo",
      teamPosition: "Customer Success Manager",
    },
    {
      id: 3,
      imgSrc:
        "https://ik.imagekit.io/zusxqcpbw/tr:w-400/team3.avif?updatedAt=1694600057617",
      teamName: "Naledi Petersen",
      teamPosition: "Digital Product Engineer",
    },
  ];

  return (
    <div>
      <SectionHeader title="ABOUT US" />
      <div className="flex constant-padding about-hero-container header-margin">
        <div>
          <LazyLoadImage
            effect="blur"
            src="https://ik.imagekit.io/zusxqcpbw/tr:w-600/hero-img-plain3.png?updatedAt=1694598286615"
            className="about-img"
            alt="car image"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src={logoWhite}
            alt="logo"
            className="logo about-logo-img"
          />
          <img />
          <h3
            className="about-logo header-margin2 standard-fz sec-font-clr"
            style={{ fontStyle: "italic" }}
          >
            We Are Committed To Safe, Reliable Mobility For South Africa
          </h3>
          <div className="offers sub-header-margin">
            <div
              className="flex-plain pri-font-clr"
              style={{ gap: ".5em" }}
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="500"
            >
              <i className="fa-solid fa-circle-check sec-font-clr2"></i>
              <p className="standard-fz sec-font">Quality Services</p>
            </div>
            <div
              className="flex-plain pri-font-clr"
              style={{ gap: ".5em" }}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="500"
            >
              <i className="fa-solid fa-circle-check sec-font-clr2"></i>
              <p className="standard-fz sec-font">Quality Vehicles</p>
            </div>
            <div
              className="flex-plain pri-font-clr"
              style={{ gap: ".5em" }}
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="500"
            >
              <i className="fa-solid fa-circle-check sec-font-clr2"></i>
              <p className="standard-fz sec-font">Transparent Pricing</p>
            </div>
            <div
              className="flex-plain pri-font-clr"
              style={{ gap: ".5em" }}
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="500"
            >
              <i className="fa-solid fa-circle-check sec-font-clr2"></i>
              <p className="standard-fz sec-font">Fast Booking Support</p>
            </div>
            <div
              className="flex-plain pri-font-clr"
              style={{ gap: ".5em" }}
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="500"
            >
              <i className="fa-solid fa-circle-check sec-font-clr2"></i>
              <p className="standard-fz sec-font">24hr Availability</p>
            </div>
            <div
              className="flex-plain pri-font-clr"
              style={{ gap: ".5em" }}
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="500"
            >
              <i className="fa-solid fa-circle-check sec-font-clr2"></i>
              <p className="standard-fz sec-font">24hr Customer Service</p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ paddingBottom: "2.5em" }}
        className="constant-margin transition about-writeup"
      >
        <div>
          <p
            className="standard-fz sec-font-clr sub-header-margin"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            MzansiRides exists to make reliable car rental simple for every
            South African traveler. Whether you are moving between business
            meetings in Sandton, planning a family trip to Durban, or taking a
            weekend drive through the Western Cape, our mission is to keep your
            journey smooth, affordable, and stress-free.
          </p>
          <p
            className="standard-fz sec-font-clr sub-header-margin"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="500"
          >
            We build around local needs first: clear daily rates, practical
            vehicle choices, and fast booking flows that work on mobile. From
            selecting the right class of vehicle to managing pick-up and
            drop-off points, MzansiRides keeps customers in full control at
            every stage.
          </p>
          <p
            className="standard-fz sec-font-clr sub-header-margin"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="500"
          >
            Our fleet strategy is designed for the realities of South African
            roads. We offer efficient city cars, premium sedans, and roomy SUVs
            so customers can choose exactly what they need for work, family, or
            adventure. Add-ons and flexible rental options help tailor each
            booking to the customer.
          </p>
          <p
            className="standard-fz sec-font-clr"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="500"
          >
            Our long-term vision is to become the most trusted rental mobility
            platform in Mzansi by combining technology, service excellence, and
            community-focused partnerships. MzansiRides is building a car rental
            experience that feels local, dependable, and proudly South African.
          </p>
        </div>
      </div>
      <div className="flex-plain constant-padding header-margin2 about-newsletter-container">
        <div
          className="download-links-img"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <h2 className="sec-font standard-fz2">We Are Available On Mobile</h2>
          <p className="min-font sec-font-clr sub-header-margin about-sub-title">
            Book and manage your rentals from your phone anytime.
          </p>
          <div className="img-wrapper flex-plain">
            <button>
              <LazyLoadImage
                effect="blur"
                className="scale transition"
                src={playStoreImg}
                alt="play store"
              />
            </button>
            <button>
              <LazyLoadImage
                effect="blur"
                className="scale transition"
                src={appStoreImg}
                alt="app store"
              />
            </button>
          </div>
        </div>
        <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="500">
          <LazyLoadImage
            effect="blur"
            className="phone-gif"
            src={phoneGif}
            alt="phone swiping"
          />
        </div>
      </div>
      <div className="flex-plain constant-padding constant-margin about-newsletter-container about-newsletter">
        <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="500">
          <LazyLoadImage
            effect="blur"
            className="phone-gif"
            src={newsletterGif}
            alt="newsletter image"
          />
        </div>
        <div data-aos="fade-up">
          <h2 className="sec-font standard-fz2">Newsletter</h2>
          <p className="min-font sec-font-clr sub-header-margin">
            Subscribe for route ideas, rental offers, and MzansiRides updates.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="constant-padding constant-margin">
        <h1 className="sec-font standard-fz2 sub-header-margin about-titles">
          Meet The MzansiRides Team
        </h1>
        <div className="cars-container">
          {teamData.map((data, index) => {
            return (
              <div
                key={data.id}
                className="team-container shadow"
                data-aos="slide-up"
                data-aos-delay={index * 100}
              >
                <img
                  loading="lazy"
                  className="sub-header-margin"
                  src={data.imgSrc}
                  alt={data.teamName}
                />
                <div className="team-content align">
                  <h2 className="standard-fz sub-header-margin">
                    {data.teamName}
                  </h2>
                  <p
                    style={{ textTransform: "uppercase" }}
                    className="sec-font-clr min-font standard-weight"
                  >
                    {data.teamPosition}
                  </p>
                </div>
                <div className="team-overlay flex transition">
                  <div className="social-handle scale transition">
                    <a href="">
                      <i className="fa-brands fa-facebook-f pri-bg standard-fz"></i>
                    </a>
                  </div>
                  <div className="social-handle scale transition">
                    <a href="">
                      <i className="fa-brands fa-twitter pri-bg standard-fz"></i>
                    </a>
                  </div>
                  <div className="social-handle scale transition">
                    <a href="">
                      <i className="fa-brands fa-linkedin-in pri-bg standard-fz"></i>
                    </a>
                  </div>
                  <div className="social-handle scale transition">
                    <a href="">
                      <i className="fa-brands fa-pinterest-p pri-bg standard-fz"></i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
