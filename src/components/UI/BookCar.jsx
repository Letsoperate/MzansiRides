import "../../styles/bookcar.css";
import Title from "./Title";

export default function BookCar() {
  
  return (
    <section className="book-car-section constant-margin">
      <Title title="Book a Car"/>
      <form action="">
        <div className="flex-main form-wrapper" data-aos="fade-up" data-aos-delay= "100">
          <div>
            <p>
              Select Car Type <i className="fa-solid fa-gears"></i>
            </p>
            <select required name="transmission">
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
          <div>
            <p>
              Pick-up <i className="fa-solid fa-location-dot"></i>
            </p>
            <input required type="text" placeholder="Enter pick up location" />
          </div>
        </div>
        <div className="flex-main form-wrapper" data-aos="fade-up" data-aos-delay="200">
          <div>
            <p>
              Drop-off <i className="fa-solid fa-location-dot"></i>
            </p>
            <input required type="text" placeholder="Enter drop off location" />
          </div>
          <div>
            <p>
              Journey Time <i className="fa-solid fa-clock"></i>
            </p>
            <input required type="time" />
          </div>
        </div>
        <div className="flex-main form-wrapper" data-aos="fade-up" data-aos-delay="300">
          <div>
            <p>
              Pick-up Date <i className="fa-regular fa-calendar-days"></i>
            </p>
            <input required type="date" />
          </div>
          <div>
            <p>
              Drop-off Date <i className="fa-regular fa-calendar-days"></i>
            </p>
            <input required type="date" />
          </div>
        </div>
        <button type="submit" className="pri-bg standard-weight transition" data-aos="fade-up" data-aos-delay="400">
          Search <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </section>
  );
}
