import React from "react";
import PropTypes from "prop-types";

const CardComponent = ({ icon, color, title, count }) => (
  <div
    className="card"
    style={{
      width: "10rem",
      background: color,
      margin: "20px",
      border: "ButtonShadow",
      height: "10rem",
    }}
  >
    <div className="card-body">
      {icon}
      <h5 className="card-title">{count}</h5>
      <h6
        className="card-subtitle mb-2 text-muted"
        style={{ fontFamily: "fantasy", fontSize: "larger" }}
      >
        {title}
      </h6>
    </div>
  </div>
);

CardComponent.propTypes = {
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export default CardComponent;
