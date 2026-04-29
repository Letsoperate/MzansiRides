import Drive from "../../assets/images/Steps-Images/Drive.gif";
import Call from "../../assets/images/Steps-Images/Call.gif";
import Choose from "../../assets/images/Steps-Images/Choose.gif";
import "../../styles/steps.css";
import Title from "./Title";

const processes = [
  {
    title: "Pick Your Car",
    imgUrl: Choose,
    moreInfo:
      "Browse trusted MzansiRides vehicles by size, comfort, and budget to match your trip anywhere in South Africa.",
  },
  {
    title: "Confirm Your Booking",
    imgUrl: Drive,
    moreInfo:
      "Lock in your preferred dates and extras in minutes, with friendly support ready whenever you need help.",
  },
  {
    title: "Collect And Drive",
    imgUrl: Call,
    moreInfo:
      "Pick up your car and enjoy smooth driving from Johannesburg to Cape Town, Durban, and beyond.",
  },
];

export default function Steps() {
  return (
    <div className="constant-padding constant-margin">
      <Title title="How MzansiRides Works" />

      <div className="steps-wrapper align pri-font-clr">
        {processes.map((process, index) => {
          return (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 200}
            >
              <img
                loading="lazy"
                src={process.imgUrl}
                className="steps-img header-margin transition"
                alt={process.title}
              />
              <p className="sec-font3 steps-title">{process.title}</p>
              <p
                style={{ lineHeight: "1.2rem" }}
                className="sec-font-clr min-font standard-weight"
              >
                {process.moreInfo}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
