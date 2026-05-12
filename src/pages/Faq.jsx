import { useContext,useEffect,useRef,useState, } from "react";

import SectionHeader from "../components/UI/SectionHeader";
import faqData from "../assets/data/faqData";
import { ToggleContext } from "../App";
import "../styles/faq.css";
import { toast } from "react-toastify";

export default function Faq() {
  const { setDisplayHeader } = useContext(ToggleContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - FAQs";
  }, []);

  const [clickedAccordion, setClickedAccordion] = useState(null);

  function toggleFaqState(i) {
    if (clickedAccordion == i) {
      return setClickedAccordion(null);
    }
    setClickedAccordion(i);
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const inputRef = useRef(null);
  const questionRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function notify(e) {
    e.preventDefault();
    const email = inputRef.current.value;
    const question = questionRef.current.value;

    if (email === "" && question === "") {
      toast.error("Please fill in the fields", { theme: "dark" });
      return;
    }
    if (email.match(emailRegex) && question === "") {
      toast.error("Please enter a question", { theme: "dark" });
      return;
    }
    if (!email.match(emailRegex)) {
      toast.error("Please enter a valid email", { theme: "dark" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/public/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, question }),
      });
      if (res.ok) {
        toast.success("Your question has been sent successfully, we will email you the answer shortly.", { theme: "dark" });
        inputRef.current.value = "";
        questionRef.current.value = "";
      } else {
        toast.error("Failed to send question. Please try again.", { theme: "dark" });
      }
    } catch {
      toast.error("Network error. Please try again.", { theme: "dark" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const faqElement = faqData.map((data, i) => {
    return (
      <div className="accordion" key={data.id}>
        <div
          onClick={() => toggleFaqState(i)}
          className="flex accordion-container"
        >
          <p className="standard-fz pri-font-clr standard-weight">
            {data.question}
          </p>
          <i
            className={`fa-solid fa-${
              clickedAccordion === i ? "chevron-up" : "chevron-down"
            } standard-fz sec-font-clr2`}
          ></i>
        </div>
        <div
          className={`accordion-content transition ${
            clickedAccordion === i ? "accordion-open" : ""
          }`}
        >
          <div>
            <p className="sec-font-clr standard-weight standard-fz">
              {data.answer}
            </p>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div>
      <SectionHeader title="FAQS" />
      <div className="constant-padding constant-margin">
        <div className="faq-wrapper header-margin2">{faqElement}</div>
        <p className="standard-fz pri-font-clr align">
          Didn't find the answer to your desired question?
        </p>
        <p className="standard-fz sec-font-clr align sub-header-margin">
          Please send it directly to us below:
        </p>
        <form action="" className="header-margin2">
          <div className="form-wrapper">
            <input
              ref={inputRef}
              type="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-wrapper">
            <textarea
              ref={questionRef}
              cols="30"
              rows="6"
              placeholder="Enter your question"
              required
            ></textarea>
          </div>
          <button
            onClick={notify}
            className="pri-bg transition standard-weight"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "SENDING..." : "SEND QUESTION"}
            <i
              style={{ marginLeft: ".4em" }}
              className="fa-solid fa-paper-plane"
            ></i>
          </button>
        </form>
        <p className="align">
          <i
            style={{ marginRight: ".4em" }}
            className="fa-solid fa-phone sec-font-clr2"
          ></i>
          <a
            style={{ textDecoration: "none" }}
            className="standard-fz sec-font-clr2 standard-weight"
            href="tel:+12345678900"
          >
            Or contact us via phone call?
          </a>
        </p>
      </div>
    </div>
  );
}
