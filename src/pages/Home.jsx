import { useContext, useEffect } from "react";

import BecomeADriver from "../components/UI/BecomeADriver";
import BookCar from "../components/UI/BookCar";
import Hero from "../components/UI/Hero";
import HotDeals from "../components/UI/HotDeals";
import LatestBlog from "../components/UI/LatestBlog";
import Partners from "../components/UI/Partners";
import Steps from "../components/UI/Steps";
import Testimonial from "../components/UI/Testimonial";
import { ToggleContext } from "../App";

export default function Home() {
  const { setDisplayHeader } = useContext(ToggleContext);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - Home";
  }, []);

  return (
    <div>
      <Hero />
      <BookCar />
      <Steps />
      <HotDeals />
      <BecomeADriver />
      <Testimonial />
      <LatestBlog />
      <Partners />
    </div>
  );
}
