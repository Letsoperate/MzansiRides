import { useContext, useEffect, useRef, useState } from "react";

import { Link, useParams } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import "../styles/reserve.css";
import { ToggleContext } from "../App";
import PaystackPop from "@paystack/inline-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reserve() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const { id } = useParams();
  const carName = decodeURIComponent(id);

  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);

    async function fetchCar() {
      try {
        const res = await fetch("/api/public/cars");
        const data = await res.json();
        const car = data.find((c) => c.name === carName) || data[0];
        setSelectedCar(car);
      } catch (err) {
        console.error("Failed to fetch car:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCar();
  }, [carName, setDisplayHeader]);

  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;

  const [isBtnVisible, setIsBtnVisible] = useState(false);
  const [isPersonalUse, setIsPersonalUse] = useState(false);

  function toggleBtnVisibility() {
    setIsBtnVisible((prev) => !prev);
  }

  function handlePersonalUseClick(e) {
    setIsPersonalUse(e.target.value === "Personal use");
  }

  const [carPrice, setCarPrice] = useState(0);

  useEffect(() => {
    if (selectedCar) setCarPrice(parseInt(selectedCar.dailyRate) || 0);
  }, [selectedCar]);

  function handlePriceChange(e) {
    const value = parseInt(e.target.value);
    setCarPrice((prev) => e.target.checked ? prev + value : prev - value);
  }

  let maxDate;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const cityRef = useRef(null);
  const pickUpDateRef = useRef(null);
  const dropOffDateRef = useRef(null);
  const pickUpTimeRef = useRef(null);
  const dropOffTimeRef = useRef(null);
  const licenseRef = useRef(null);
  const passportRef = useRef(null);
  const confirmRef = useRef(null);
  const priceRef = useRef(null);

  function handleMaxDateCheck() {
    maxDate = dropOffDateRef.current.value;
    pickUpDateRef.current.max = maxDate;
    checkTotalPrice();
  }

  function handleMinDateCheck() {
    const minDate = pickUpDateRef.current.value;
    dropOffDateRef.current.min = minDate;
    checkTotalPrice();
  }

  function checkTotalPrice() {
    if (!pickUpDateRef.current || !dropOffDateRef.current) return;
    const startDate = new Date(pickUpDateRef.current.value);
    const endDate = new Date(dropOffDateRef.current.value);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      if (daysDifference > 0) {
        priceRef.current.innerText = `R${carPrice * daysDifference}`;
      } else if (daysDifference === 0) {
        priceRef.current.innerText = `R${carPrice}`;
      } else {
        alert("Drop off date must be after pick up date");
        setIsBtnVisible(false);
        confirmRef.current.checked = false;
      }
    }
  }

  useEffect(() => {
    checkTotalPrice();
  }, [carPrice]);

  function getTotalPrice() {
    return parseInt(priceRef.current.innerText.replace("R", "")) || parseInt(selectedCar.dailyRate) || 0;
  }

  function PayStack() {
    const paystack = new PaystackPop();
    const totalPrice = getTotalPrice();
    paystack.newTransaction({
      key: "pk_test_51feaff4a12e482f6d6f9518147935823c73d0d8",
      amount: totalPrice * 100,
      email: emailRef.current.value,
      firstName: nameRef.current.value,
      async onSuccess(transaction) {
        toast.success(`Payment Complete! Reference ${transaction.reference}`, { theme: "dark" });

        try {
          await fetch("/api/public/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: nameRef.current.value,
              city: cityRef.current.value || "Johannesburg",
              carName: selectedCar.name,
              phone: phoneRef.current.value,
              email: emailRef.current.value,
              checkoutDate: pickUpDateRef.current.value,
              dropoffDate: dropOffDateRef.current.value,
              totalAmount: totalPrice,
            }),
          });
        } catch {}

        nameRef.current.value = "";
        emailRef.current.value = "";
        phoneRef.current.value = "";
        cityRef.current.value = "";
        pickUpDateRef.current.value = "";
        pickUpTimeRef.current.value = "";
        dropOffDateRef.current.value = "";
        dropOffTimeRef.current.value = "";
        setIsBtnVisible(false);
        confirmRef.current.checked = false;
      },
      onCancel() {
        toast.error("Transaction Canceled", { theme: "dark" });
      },
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const hasBasicFields = nameRef.current.value !== "" &&
      emailRef.current.value.match(emailRegex) &&
      pickUpTimeRef.current.value !== "" &&
      dropOffTimeRef.current.value !== "" &&
      pickUpDateRef.current.value !== "" &&
      dropOffDateRef.current.value !== "";

    if (isPersonalUse) {
      if (!hasBasicFields || licenseRef.current.files.length === 0 || passportRef.current.files.length === 0) {
        toast.error("Please fill in all required fields", { theme: "dark" });
        return;
      }
    } else {
      if (!hasBasicFields) {
        toast.error("Please fill in all required fields", { theme: "dark" });
        return;
      }
    }
    PayStack();
  }

  if (isLoading || !selectedCar) {
    return (
      <div>
        <SectionHeader title="RESERVE CAR" />
        <div className="constant-padding constant-margin" style={{ textAlign: "center", paddingTop: "3rem" }}>
          <p className="min-font" style={{ color: "hsl(141, 40%, 75%)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="RESERVE CAR" />
      <div className="constant-padding constant-margin">
        <p className="sec-font align header-margin2 sec-font-clr title-fz reserve-car-title">
          {selectedCar.name}
        </p>
        <div className="reserve-car-img-container header-margin">
          <img loading="lazy" src={selectedCar.image} alt={selectedCar.name} onError={(e) => { e.target.src = "https://ik.imagekit.io/zusxqcpbw/tr:w-600/hero-img-plain3.png?updatedAt=1694598286615"; }} />
        </div>
        <div className="reserve-car-info flex-main">
          <div className="shadow btn-padding align pri-font-clr min-font standard-weight spacing">
            <i style={{ marginRight: ".4em" }} className="fa-solid fa-money-bill sec-font-clr2"></i>
            R{parseInt(selectedCar.dailyRate)}/day
          </div>
          <div className="shadow btn-padding align pri-font-clr min-font standard-weight spacing">
            <i style={{ marginRight: ".4em" }} className="fa-solid fa-tag sec-font-clr2"></i>
            {selectedCar.category}
          </div>
          <div className="shadow btn-padding align pri-font-clr min-font standard-weight spacing">
            <i style={{ marginRight: ".4em" }} className="fa-solid fa-circle-info sec-font-clr2"></i>
            {selectedCar.status}
          </div>
          <div className="shadow btn-padding align pri-font-clr min-font standard-weight spacing">
            <i style={{ marginRight: ".4em" }} className="fa-solid fa-star sec-font-clr2"></i>
            {selectedCar.description || "No description"}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr">
          Fill In The Rental Details
        </p>
        <div style={{ gap: ".7em" }} className="flex-main form-wrapper sub-header-margin">
          <input ref={nameRef} required type="text" placeholder="Enter full name" />
          <input ref={emailRef} required type="email" placeholder="Enter email" />
        </div>
        <div style={{ gap: ".7em" }} className="flex-main form-wrapper sub-header-margin">
          <input ref={phoneRef} type="tel" placeholder="Phone number" />
          <input ref={cityRef} type="text" placeholder="City (e.g. Johannesburg)" />
        </div>
        <div style={{ gap: ".7em" }} className="flex-main form-wrapper sub-header-margin">
          <div>
            <p>Pick Up Date</p>
            <input ref={pickUpDateRef} onChange={handleMinDateCheck} required type="date" min={`${year}-${month}-${day}`} max={maxDate} />
          </div>
          <div>
            <p>Drop Off Date</p>
            <input ref={dropOffDateRef} onChange={handleMaxDateCheck} required type="date" min={`${year}-${month}-${day}`} />
          </div>
        </div>
        <div style={{ gap: ".7em" }} className="flex-main form-wrapper sub-header-margin">
          <div>
            <p>Pick Up Time</p>
            <input ref={pickUpTimeRef} required type="time" />
          </div>
          <div>
            <p>Drop Off Time</p>
            <input ref={dropOffTimeRef} required type="time" />
          </div>
        </div>
        <div className="sub-header-margin">
          <p className="standard-fz sub-header-margin">Select additional service(s):</p>
          <div className="flex-main form-wrapper sub-header-margin">
            <div className="flex-plain">
              <input onClick={handlePriceChange} id="GPS" value="10" className="reserve-input" type="checkbox" />
              <label htmlFor="GPS" className="min-font sec-font-clr standard-weight pri-font-clr">GPS (R10)</label>
            </div>
            <div className="flex-plain">
              <input onClick={handlePriceChange} id="insurance" value="30" className="reserve-input" type="checkbox" />
              <label htmlFor="insurance" className="min-font sec-font-clr standard-weight pri-font-clr">Insurance (R30)</label>
            </div>
            <div className="flex-plain">
              <input onClick={handlePriceChange} value="5" id="child-seats" className="reserve-input" type="checkbox" />
              <label htmlFor="child-seats" className="min-font sec-font-clr standard-weight pri-font-clr">Child Seats (R5)</label>
            </div>
          </div>
        </div>
        <div className="sub-header-margin">
          <p>Purpose Of Rent:</p>
          <select onChange={handlePersonalUseClick} required name="purpose" id="purpose">
            <option className="standard-weight" value="Tour">Tour</option>
            <option className="standard-weight" value="Personal use">Personal use</option>
          </select>
        </div>
        {isPersonalUse && (
          <div>
            <div className="CV-wrapper flex-main form-wrapper pri-font-clr">
              <label htmlFor="driver-license" className="standard-weight sec-font-clr">
                Upload Driver&apos;s License <i className="fa-solid fa-file sec-font-clr2"></i>
              </label>
              <input ref={licenseRef} required style={{ flex: 1 }} id="driver-license" type="file" />
            </div>
            <div className="CV-wrapper flex-main form-wrapper sub-header-margin pri-font-clr">
              <label htmlFor="passport" className="standard-weight sec-font-clr">
                Upload Valid Passport <i className="fa-solid fa-file sec-font-clr2"></i>
              </label>
              <input ref={passportRef} required style={{ flex: 1 }} id="passport" type="file" />
            </div>
          </div>
        )}
        <div className="sub-header-margin">
          <div className="flex-plain">
            <input onClick={toggleBtnVisibility} ref={confirmRef} className="reserve-input" type="checkbox" id="agree" />
            <label className="pri-font-clr standard-weight" htmlFor="agree">
              By clicking, you accept our{" "}
              <Link style={{ textDecoration: "none" }} className="sec-font-clr2" to="/privacy-policy">
                terms and policies
              </Link>
            </label>
          </div>
        </div>
        <div className="sub-header-margin align">
          <p className="standard-fz">
            Total cost: <span ref={priceRef} className="sec-font-clr2" style={{ fontSize: "1.2rem" }}>R{carPrice}</span>
          </p>
        </div>
        {isBtnVisible && (
          <button type="submit" className="pri-bg transition standard-weight">
            RESERVE <i style={{ marginLeft: ".4em" }} className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        )}
      </form>
    </div>
  );
}
