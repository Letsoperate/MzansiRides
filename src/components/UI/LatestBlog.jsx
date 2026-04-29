import Title from "./Title";
import blogData from "../../assets/data/blogData";
import "../../styles/latestBlog.css";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function LatestBlog(props) {
  return (
    <div className="constant-margin constant-padding">
      {!props.displayHeader && <Title title="Latest Blogs" />}
      <div className="cars-container">
        {blogData.map((data, index) => {
          return (
            <div
              key={data.id}
              className="blog-container transition shadow"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 200}
              data-aos-duration="500"
            >
              <LazyLoadImage
                effect="blur"
                src={data.imgUrl}
                alt="blog image"
                className="sub-header-margin blog-image"
              />
              <div className="sub-header-margin blog-content-container">
                <h2 className="standard-fz sub-header-margin">
                  {data.blogTitle}
                </h2>
                <p className="standard-fz sec-font-clr sec-font sub-header-margin">
                  {data.blogContent}
                </p>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/blogs/blog${data.id}`}
                >
                  <p className="standard-weight sub-header-margin blog-btn transition">
                    {data.buttonContent}
                  </p>
                </Link>
                <div className="poster-content min-font flex-main">
                  <p className="sec-font-clr standard-weight">
                    <i className="fa-solid fa-user sec-font-clr2"></i>{" "}
                    {data.userName}
                  </p>
                  <div className="details flex">
                    <p className="sec-font-clr">
                      <i className="fa-solid fa-calendar-days sec-font-clr2"></i>{" "}
                      {data.date}
                    </p>{" "}
                    <p className="sec-font-clr">
                      <i className="fa-solid fa-clock sec-font-clr2"></i>{" "}
                      {data.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
