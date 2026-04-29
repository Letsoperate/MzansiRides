import { useContext,useEffect,useRef,useState, } from "react";

import { ToggleContext } from "../App";
import SectionHeader from "../components/UI/SectionHeader";
import { toast } from "react-toastify";

export default function Driver() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - Become a Driver";
  }, []);

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        const countriesArray = data.map((country) => country.name);
        setCountries(countriesArray);
      })
      .catch(() => {});
  }, []);

  const optionsElement = countries.map((country, index) => (
    <option className="standard-weight" key={index} value={country}>
      {country}
    </option>
  ));

  async function handleDriverSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    const formData = new FormData(form);
    const firstName = formData.get("firstName") || "";
    const lastName = formData.get("lastName") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const city = formData.get("countries") || "";

    if (!firstName || !lastName || !email || !phone || city === "select") {
      toast.error("Please fill in all required fields", { theme: "dark" });
      return;
    }
    try {
      await fetch("/api/public/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: `${firstName} ${lastName}`,
          email,
          phone,
          city,
        }),
      });
      toast.success("Application submitted successfully! We'll be in touch.", { theme: "dark" });
      form.reset();
    } catch {
      toast.error("Failed to submit. Please try again.", { theme: "dark" });
    }
  }

  return (
    <div>
      <SectionHeader title="BECOME A DRIVER" />
      <form ref={formRef} onSubmit={handleDriverSubmit} className="signin-form constant-margin sec-bg" action="">
        <p className="standard-fz header-margin align sec-font sec-font-clr">
          Register Your Account
        </p>
        <div
          style={{ gap: ".7em" }}
          className="flex-main form-wrapper sub-header-margin"
        >
          <input name="firstName" required type="text" placeholder="Enter first name" />
          <input name="lastName" required type="text" placeholder="Enter last name" />
        </div>
        <div
          style={{ gap: ".7em" }}
          className="flex-main form-wrapper sub-header-margin"
        >
          <input name="email" required type="email" placeholder="Enter email" />
          <input
            name="phone"
            required
            type="tel"
            pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}"
            placeholder="Enter phone number"
          />
        </div>
        <div className="sub-header-margin">
          <select required name="countries" id="countries">
            <option className="standard-weight" value="select">Select Your City</option>
            {optionsElement}
          </select>
        </div>
        <div className="CV-wrapper flex-main form-wrapper sub-header-margin pri-font-clr">
          <label htmlFor="file" className="standard-weight sec-font-clr">
            Upload your CV <i className="fa-solid fa-file sec-font-clr2"></i>
          </label>
          <input
            required
            style={{ flex: 1 }}
            id="file"
            type="file"
            placeholder="Enter email"
          />
        </div>
        <div className="sub-header-margin">
          <p>Choose Favorable Working Hours</p>
          <select required name="countries" id="countries">
            <option className="standard-weight" value="morning">Morning</option>
            <option className="standard-weight" value="afternoon">Afternoon</option>
            <option className="standard-weight" value="evening">Evening</option>
          </select>
        </div>
        <div className="sub-header-margin">
          <p>Why should we hire you?</p>
          <textarea cols="30" rows="6"></textarea>
        </div>
        <button className="pri-bg transition standard-weight">
          SUBMIT FOR REVIEW
          <i
            style={{ marginLeft: ".4em" }}
            className="fa-solid fa-paper-plane"
          ></i>
        </button>
      </form>
    </div>
  );
}
