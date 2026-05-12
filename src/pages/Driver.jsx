import { useContext, useEffect, useRef, useState } from "react";

import { ToggleContext } from "../App";
import SectionHeader from "../components/UI/SectionHeader";
import { toast } from "react-toastify";

export default function Driver() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const formRef = useRef(null);
  const cityInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - Become a Driver";
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps && cityInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(cityInputRef.current, {
        types: ["(cities)"],
        componentRestrictions: { country: "za" },
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address && cityInputRef.current) {
          cityInputRef.current.value = place.formatted_address;
        }
      });
    }
  }, []);

  async function handleDriverSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    const formData = new FormData(form);
    const firstName = formData.get("firstName") || "";
    const lastName = formData.get("lastName") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const workHours = formData.get("workHours") || "";
    const reason = formData.get("reason") || "";
    const city = cityInputRef.current?.value || "";

    if (!firstName || !lastName || !email || !phone || !city) {
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
      if (cityInputRef.current) cityInputRef.current.value = "";
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
          <input ref={cityInputRef} required type="text" placeholder="Type your city (e.g. Johannesburg)" />
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
          />
        </div>
        <div className="sub-header-margin">
          <p>Choose Favorable Working Hours</p>
          <select required name="workHours" id="workHours">
            <option className="standard-weight" value="morning">Morning</option>
            <option className="standard-weight" value="afternoon">Afternoon</option>
            <option className="standard-weight" value="evening">Evening</option>
          </select>
        </div>
        <div className="sub-header-margin">
          <p>Why should we hire you?</p>
          <textarea name="reason" cols="30" rows="6"></textarea>
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
