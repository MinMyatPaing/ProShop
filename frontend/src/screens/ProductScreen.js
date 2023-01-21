import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
  FormGroup,
} from "react-bootstrap";

import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import {
  fetchProductDetails,
  clearProductDetails,
  createReview,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";

const ProductScreen = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productState = useSelector((state) => state.product);
  const {
    isSingleProductFetching,
    error,
    selectedProduct,
    reviewLoading,
    reviewError,
  } = productState;

  const authState = useSelector((state) => state.auth);
  const { userInfo } = authState;

  useEffect(() => {
    dispatch(fetchProductDetails(id));

    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id, quantity: Number(quantity) }));
    navigate(`/cart`);
  };

  const reviewSubmitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createReview({ id: id, rating: rating, comment: comment }));
    dispatch(fetchProductDetails(id));
  };

  if (isSingleProductFetching || !selectedProduct.name) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <>
      <Link to="/" className="btn btn-light">
        Go Back
      </Link>
      <Meta title={selectedProduct.name} />
      <Row>
        <Col className="product-page-section" md={6}>
          <Image src={selectedProduct.image} fluid />
        </Col>
        <Col className="product-page-section" md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{selectedProduct.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={selectedProduct.rating} />
              {selectedProduct.numReviews} review(s)
            </ListGroup.Item>
            <ListGroup.Item>Price: ${selectedProduct.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: {selectedProduct.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col className="product-page-section" md={3}>
          <ListGroup>
            <ListGroup.Item>
              <Row>
                <Col>Price:</Col> <Col>${selectedProduct.price}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col className="product-page-section">Status:</Col>{" "}
                <Col>
                  {selectedProduct.countInStock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </Col>
              </Row>
            </ListGroup.Item>
            {selectedProduct.countInStock > 0 && (
              <ListGroup.Item>
                <Row>
                  {" "}
                  <Col>Quantity:</Col>{" "}
                  <Col>
                    <Form.Select
                      as="select"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    >
                      {[...Array(selectedProduct.countInStock).keys()].map(
                        (index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        )
                      )}
                    </Form.Select>
                  </Col>
                </Row>
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <Button className="btn w-100" onClick={addToCartHandler}>
                Add to Cart
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h1>List of Reviews</h1>
          <ListGroup variant="flush">
            {selectedProduct.reviews.length <= 0 && (
              <Message>No reviews for this product.</Message>
            )}
            {selectedProduct.reviews.map((review, index) => (
              <ListGroup.Item key={index}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {reviewLoading && <Loader />}
              {reviewError && <Message variant="danger">{reviewError}</Message>}
              {userInfo ? (
                <Form onSubmit={reviewSubmitHandler}>
                  <FormGroup controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Abysmal</option>
                      <option value="2">2 - Poor</option>
                      <option value="3">3 - Average</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Select>
                  </FormGroup>
                  <FormGroup controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </FormGroup>
                  <Button type="submit" className="btn-sm my-3">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">Log In</Link> to write a review.
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
