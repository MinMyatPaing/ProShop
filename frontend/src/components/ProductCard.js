import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Rating from "./Rating";

const ProductCard = ({ product }) => {
  return (
    <Card className="my-2 py-3 rounded">
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <Card.Title as="div" style={{ height: 40 }}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div" className="my-3">
          <Rating value={product.rating} numReviews={product.numReviews} />
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
