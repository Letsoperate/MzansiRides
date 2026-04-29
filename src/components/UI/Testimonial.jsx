import "../../styles/testimonial.css";
import Title from "./Title";
import clientTwo from "../../assets/images/Testimonial-images/user2.jpg";
import clientThree from "../../assets/images/Testimonial-images/user3.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Testimonial() {
  const testimonialData = [
    {
      id: 1,
      name: "Pete Daniels",
      position: "Client",
      testimony:
        "We rented a car from this website to go camping in the outskirts of town, the process was very easy and we really enjoyed the ride.",
      customerImg:
        "https://ik.imagekit.io/zusxqcpbw/tr:w-200/user1.jpg?updatedAt=1694598983137",
    },
    {
      id: 2,
      name: "David Levington",
      position: "Client",
      testimony:
        "A friend introduced me to this website and just when I needed a card to ride to an occassion, I got it really fast and easy.",
      customerImg: clientTwo,
    },
    {
      id: 3,
      name: "Anna Stones",
      position: "Client",
      testimony:
        "This website is unbelievably reliable, the drive was smooth, the car wasn't even faulty at all and the prices were affordable.",
      customerImg: clientThree,
    },
  ];

  return (
    <div className="constant-padding constant-margin">
      <Title title="Client's Testimonial" />
      <div className="cars-container">
        {testimonialData.map((data, index) => {
          return (
            <div
              key={data.id}
              className="testimonial-container blog-container transition shadow"
              data-aos="fade-up"
              data-aos-duration="500"
              data-aos-delay={index * 100}
            >
              <p
                style={{ lineHeight: 1.55 }}
                className="sec-font-clr standard-fz header-margin standard-fz sec-font"
              >
                "{data.testimony}"
              </p>
              <div className="customer-wrapper flex-main">
                <div className="flex" style={{ gap: "1em" }}>
                  <LazyLoadImage
                    effect="blur"
                    className="customer-img"
                    src={data.customerImg}
                    alt="customer image"
                  />
                  <div className="customer-info">
                    <p style={{ marginBottom: ".5em" }} className="standard-fz customer-name">
                      {data.name}
                    </p>
                    <p className="standard-fz client-position">{data.position}</p>
                  </div>
                </div>
                <div>
                  <i className="fa-solid fa-quote-right sec-font-clr2 title-fz"></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
