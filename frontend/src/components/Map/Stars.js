import React from "react";
import PropTypes from 'prop-types';
import './Stars.css'

const Stars = ({stars,size = 15,spacing = 2, fill = "#ea9c46"}) => {
  return <div className="Stars" style={{ "--stars": stars, "--size": (size + "px"), "--spacing": (spacing + "px") , "--fill":fill}}></div>;
};

Stars.propTypes = {
    stars: PropTypes.number.isRequired,
    size: PropTypes.number,
    spacing: PropTypes.number,
    fill: PropTypes.string
};
  
export default Stars;