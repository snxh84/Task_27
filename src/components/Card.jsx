import "./Card.css";

/**
 * Photo card used by the grid.
 *
 * Props:
 *  - color: CSS colour string used for the placeholder box
 *  - title: caption shown under the box (truncated to one line)
 */
const Card = ({ color, title }) => {
  return (
    <div className="card">
      <div className="photo" style={{ backgroundColor: color }}>
        <span className="photo-size">600 x 600</span>
      </div>
      <p className="card-title" title={title}>
        {title}
      </p>
    </div>
  );
};

export default Card;
