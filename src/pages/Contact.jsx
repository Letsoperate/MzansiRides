
import "../styles/contact.css";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import { toast } from "react-toastify";
import { useContext, useEffect, useRef } from "react";

export default function Contact() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - Contact";
  }, []);

  async function contactFormSubmit(e) {
    e.preventDefault();
    if (
      nameRef.current.value === "" ||
      emailRef.current.value === "" ||
      subjectRef.current.value === "" ||
      messageRef.current.value === ""
    ) {
      toast.error("Please fill in the fields", {
        theme: "dark",
      });
    } else if (!emailRef.current.value.match(emailRegex)) {
      toast.error("Please enter a valid email", {
        theme: "dark",
      });
    } else {
      try {
        await fetch("/api/public/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameRef.current.value,
            email: emailRef.current.value,
            subject: subjectRef.current.value,
            message: messageRef.current.value,
          }),
        });
        toast.success("Your message has been sent successfully, we will reach out to you soon", { theme: "dark" });
        nameRef.current.value = "";
        emailRef.current.value = "";
        subjectRef.current.value = "";
        messageRef.current.value = "";
      } catch {
        toast.error("Failed to send message. Please try again.", { theme: "dark" });
      }
    }
  }

  return (
    <div>
      <SectionHeader title="CONTACT US" />
      <div className="header-margin">
        <div className="map">
          <iframe
            src="https://www.google.com/maps?q=Johannesburg%2C%20South%20Africa&output=embed"
            width="100%"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="constant-padding shadow constant-margin flex-main contact-wrapper">
        <div className="contact-div">
          <p className="standard-weight align pri-font-clr standard-fz2 header-margin">
            Contact Information
          </p>
          <div
            style={{ gap: ".5em" }}
            className="flex-plain standard-fz sec-font-clr header-margin"
          >
            <i className="fa-solid fa-envelope sec-font-clr2"></i>
            <a
              style={{ textDecoration: "none" }}
              className="sec-font-clr"
              href="mailto:hello@mzansirides.co.za"
            >
              hello@mzansirides.co.za
            </a>
          </div>
          <div
            style={{ gap: ".5em" }}
            className="flex-plain standard-fz sec-font-clr header-margin"
          >
            <i className="fa-solid fa-phone sec-font-clr2"></i>
            <a
              style={{ textDecoration: "none" }}
              className="sec-font-clr"
              href="tel:+27110000000"
            >
              +27 11 000 0000
            </a>
          </div>
          <div className="links">
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
        </div>
        <div className="contact-form-container">
          <p className="standard-weight align sec-font sec-font-clr standard-fz2 header-margin">
            Send Us A Message
          </p>
          <form action="">
            <div
              style={{ gap: "1em" }}
              className="flex-main form-wrapper contact-div"
            >
              <input
                ref={nameRef}
                required
                type="text"
                placeholder="Enter your name"
              />
              <input
                ref={emailRef}
                required
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-wrapper">
              <input
                ref={subjectRef}
                required
                type="text"
                placeholder="Subject"
              />
            </div>
            <div className="form-wrapper">
              <textarea
                ref={messageRef}
                cols="30"
                rows="10"
                placeholder="Enter message"
              ></textarea>
            </div>
            <button
              onClick={contactFormSubmit}
              type="submit"
              className="pri-bg standard-weight transition"
            >
              Send Message <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
