import { useState } from "react";
import { useEffect } from "react";
import "../../styles/scroll-to-top.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  function toggleVisible() {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 1000) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  });

  return (
    <button
      onClick={scrollTop}
      className={`scroll-to-top pri-font-clr sec-bg2 scale transition ${
        visible ? "animate-button" : ""
      }`}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
