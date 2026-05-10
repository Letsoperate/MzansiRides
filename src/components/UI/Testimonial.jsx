import "../../styles/testimonial.css";
import Title from "./Title";
import clientTwo from "../../assets/images/Testimonial-images/user2.jpg";
import clientThree from "../../assets/images/Testimonial-images/user3.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Testimonial() {
  const testimonialData = [
    {
      id: 1,
      name: "Neezy Shai",
      position: "Client",
      testimony:
        "MzansiRides made my trip to Durban unforgettable. The car was spotless, fuel-efficient, and the booking process was smoother than I ever imagined.",
      customerImg: "https://ui-avatars.com/api/?name=Neezy+Shai&size=200&background=e94560&color=fff&bold=true",
    },
    {
      id: 2,
      name: "Evans Sekgota",
      position: "Client",
      testimony:
        "I needed a car urgently for a family event and MzansiRides delivered within hours. Professional service and very affordable rates. Highly recommended!",
      customerImg: "https://ui-avatars.com/api/?name=Evans+Sekgota&size=200&background=0f3460&color=fff&bold=true",
    },
    {
      id: 3,
      name: "Lucky Sekgota",
      position: "Client",
      testimony:
        "Best car rental experience in South Africa! The Toyota Hilux I rented handled the rural roads perfectly. Will definitely use MzansiRides again.",
      customerImg: "https://ui-avatars.com/api/?name=Lucky+Sekgota&size=200&background=16213e&color=fff&bold=true",
    },
    {
      id: 4,
      name: "Cathness Ntoampi",
      position: "Client",
      testimony:
        "As a frequent traveler, I've tried many rental services but MzansiRides stands out. Their customer care team went above and beyond for me.",
      customerImg: "https://ui-avatars.com/api/?name=Cathness+Ntoampi&size=200&background=1a1a2e&color=fff&bold=true",
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
