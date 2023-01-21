import PropTypes from "prop-types";

function getStarArray(ratings) {
  const starArray = [];
  for (let i = 1; i <= 5; i++) {
    if (ratings >= i) {
      starArray.push({ id: i, star: "fas fa-star" });
    } else if (ratings >= i - 0.5) {
      starArray.push({ id: i, star: "fas fa-star-half-alt" });
    } else {
      starArray.push({ id: i, star: "far fa-star" });
    }
  }
  return starArray;
}

const Rating = ({ value, color }) => {
  const starArray = getStarArray(value);

  return (
    <div className="rating">
      {starArray.map((item) => (
        <span key={item.id}>
          <i className={item.star} style={{color}}></i>
        </span>
      ))}
    </div>
  );
};

Rating.defaultProps = {
  color: "#f8e825",
  value: 0,
  numReviews: 0,
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  numReviews: PropTypes.number.isRequired,
  color: PropTypes.string,
};

export default Rating;
