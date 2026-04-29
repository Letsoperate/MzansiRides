import "../../styles/becomeadriver.css";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function BecomeADriver() {
  return (
    <div className="constant-margin constant-padding earn-with-us flex">
      <img
        className="earn-img"
        src="https://ik.imagekit.io/zusxqcpbw/tr:w-800/Lambo.png?updatedAt=1694597061473"
        alt="Lamborghini"
      />
      <div className="earn-content">
        <h2
          style={{ lineHeight: "40px" }}
          className="sec-font3 title-fz sub-header-margin"
          data-aos="fade-up"
        >
          Want To Earn With Us?
        </h2>
        <p
          style={{ lineHeight: "25px" }}
          className="standard-fz sec-font-clr header-margin standard-weight"
          data-aos="fade-up"
        >
          Take clients for a ride in their dream car today
        </p>
        <Link
          style={{ textDecoration: "none", borderRadius: "5px" }}
          className="sec-font pri-font-clr standard-fz pri-bg btn-padding"
          to="/become-a-driver"
          data-aos="fade-up"
        >
          Become A Driver
        </Link>
      </div>
      <div className="earn-bg-wrapper">
        <LazyLoadImage
          effect="blur"
          className="earn-bg"
          src="https://ik.imagekit.io/zusxqcpbw/tr:w-800/becomeAdriver.jpg?updatedAt=1694598852069"
          alt="Driving photo"
        />
        <div className="earn-overlay"></div>
      </div>
    </div>
  );
}
