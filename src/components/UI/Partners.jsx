import "../../styles/partners.css";
import Marquee from "react-fast-marquee";

export default function Partners() {
  const partnersData = [
    {
      id: 1,
      imgUrl: "https://ik.imagekit.io/zusxqcpbw/tr:w-200/mitsubishi.png?updatedAt=1694599616213",
    },
    {
      id: 2,
      imgUrl: "https://ik.imagekit.io/zusxqcpbw/tr:w-200/mazda.png?updatedAt=1694599616720",
    },
    {
      id: 3,
      imgUrl: "https://ik.imagekit.io/zusxqcpbw/tr:w-200/nissan.png?updatedAt=1694599619460",
    },
    {
      id: 4,
      imgUrl: "https://ik.imagekit.io/zusxqcpbw/tr:w-400/audi.png?updatedAt=1694599618833",
    },
    {
      id: 5,
      imgUrl: "https://ik.imagekit.io/zusxqcpbw/tr:w-200/toyota.png?updatedAt=1694599619180",
    },
    {
      id: 6,
      imgUrl: "https://ik.imagekit.io/zusxqcpbw/tr:w-200/bmw.png?updatedAt=1694599619149",
    },
  ];

  return (
    <div className=" constant-margin ">
      <Marquee autoFill={true} gradient={true} gradientColor="hsl(0, 0%, 16%)" gradientWidth={100}>
        {partnersData.map((data) => {
          return (
            <div className="partners-container" key={data.id}>
              <img
                loading="lazy"
                className="partners-logo"
                src={data.imgUrl}
                alt="partner-logo"
              />
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
