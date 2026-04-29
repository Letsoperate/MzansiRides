import blob from "../../assets/images/blob.png";

export default function Title(props) {
  return (
    <div>
      <div className="title-wrapper header-margin2" data-aos="flip-up">
        <h1 className="sec-font3 title-fz align pri-font-clr">{props.title}</h1>
        <img className="underline" src={blob} alt="blob" />
      </div>
    </div> 
  );
}
