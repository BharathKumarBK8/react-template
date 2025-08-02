import { Link } from "react-router-dom";
import { BAR_DATA } from "../../models/pageModel";

function Bar(props: BAR_DATA) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <Link to="#" className="card-body-title">
            {props.title.text}
          </Link>
          <div style={{ fontSize: "42px" }}>
            <i className="bi bi-bar-chart-line"></i>
          </div>
        </div>
      </div>
    </>
  );
}
export default Bar;
