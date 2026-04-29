import { useContext,useEffect, } from "react";

import { Link } from "react-router-dom";
import { ToggleContext } from "../App";
import ErrorGifOne from "../assets/images/Error/error-gif.gif";
import "../styles/error.css";

export default function Error() {
  const { setDisplayHeader } = useContext(ToggleContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <img className="error-img" src={ErrorGifOne} alt="error-gif" />
      <Link
        to="/home"
        style={{ textDecoration: "none", color: "white", borderRadius: "5px" }}
        className="min-font back-to-home pri-bg btn-padding standard-weight"
      >
        Drive Back Home{" "}
        <i className="fa-solid fa-car-side" style={{ marginLeft: "3px" }}></i>
      </Link>
    </div>
  );
}
