import { useContext, useEffect, useState } from "react";

import SectionHeader from "../components/UI/SectionHeader";
import blogData from "../assets/data/blogData";
import { Link, useParams } from "react-router-dom";
import "../styles/blog-details.css";
import { ToggleContext } from "../App";

export default function SelectedBlog() {
  const { setDisplayHeader } = useContext(ToggleContext);

  const blogParam = useParams();
  const blog = blogData.filter((data) => {
    return data.param === blogParam.id;
  });

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = `MzansiRides - ${blog.map((selected) => selected.blogTitle)}`;
  }, [blog]);

  return (
    <div>
      <SectionHeader title="BLOG" />
      <div className="constant-padding constant-margin selected-blog-wrapper">
        <div className="selected-blog">
          {blog.map((data) => {
            return (
              <div key={data.id}>
                <img
                  loading="lazy"
                  style={{ width: "100%", borderRadius: "30px" }}
                  className="blog-main-img sub-header-margin"
                  src={data.imgUrl}
                  alt="blog image"
                />
                <h3 className="standard-fz2 sub-header-margin">
                  {data.blogTitle}
                </h3>
                <div className="min-font flex header-margin">
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
                <p className="standard-fz sec-font-clr sec-font sub-header-margin">
                  {data.fullBlogContent}
                </p>
                <div className="header-margin2">
                  {data.keyPoints.map((keyPoint) => {
                    return (
                      <div className="sub-header-margin" key={keyPoint.id}>
                        <p
                          style={{ marginBottom: ".6em" }}
                          className="standard-fz blog-heading sec-font3 pri-font-clr"
                        >
                          {keyPoint.heading}
                        </p>
                        <p className="standard-fz sec-font-clr sec-font blog-sub-heading">
                          {keyPoint.subHeading}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="header-margin2">
                  <p className="standard-fz sec-font-clr2 standard-weight sub-header-margin">
                    Replies
                  </p>
                  {data.replies.map((reply) => {
                    return (
                      <div key={reply.id} className="flex header-margin">
                        <img
                          loading="lazy"
                          className="customer-img"
                          src={reply.pfp}
                          alt="customer image"
                        />
                        <div>
                          <div
                            style={{
                              gap: ".5em",
                              marginBottom: ".5em",
                              flexWrap: "wrap",
                            }}
                            className="flex-plain"
                          >
                            <p className="min-font standard-weight sec-font-clr">
                              {reply.user}
                            </p>
                            <p className="min-font sec-font-clr">
                              {reply.dateOfReply}
                            </p>
                            <p className="min-font sec-font-clr">
                              {reply.timeOfReply}
                            </p>
                          </div>
                          <p className="standard-font pri-font-clr sub-header-margin">
                            {reply.reply}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="reply-container">
                  <p className="standard-fz sec-font-clr2 standard-weight sub-header-margin">
                    Was this content helpful?
                  </p>
                  {!isSignedIn ? (
                    <Link
                      style={{
                        fontStyle: "italic",
                        textDecoration: "underline",
                      }}
                      className="min-font pri-font-clr standard-weight"
                      to="/sign-in"
                    >
                      You Have To Be Signed In To Reply...
                    </Link>
                  ) : (
                    <div>
                      <textarea
                        style={{ marginBottom: ".4em" }}
                        className="standard-fz"
                        rows="10"
                        placeholder="Enter your comment"
                      ></textarea>
                      <button
                        style={{ width: "100%", justifyContent: "center" }}
                        className="sec-font flex-plain standard-fz pri-bg btn-padding"
                      >
                        <p className="standard-fz standard-weight blog-submit-btn">
                          Upload Reply
                        </p>
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="rest-blog-container">
          {blogData.map((data) => {
            return (
              <div
                key={data.id}
                className="selected-blog-wrapper rest-blog-wrapper header-margin"
              >
                <img loading="lazy" src={data.imgUrl} alt="blog image" />
                <div>
                  <h1
                    style={{ marginBottom: ".3em" }}
                    className="pri-font-clr standard-fz"
                  >
                    {data.blogTitle}
                  </h1>
                  {blogParam.id !== data.param ? (
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/blogs/blog${data.id}`}
                    >
                      <p className="standard-weight sub-header-margin blog-btn transition">
                        Visit Blog
                      </p>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
