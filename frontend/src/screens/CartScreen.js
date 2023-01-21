import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  Button,
} from "react-bootstrap";

import Message from "../components/Message";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";

const CartScreen = () => {
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);
  const { userInfo } = authState;
  const { cartItems, error } = cartState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <Row>
      <Col md={12} lg={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Cart is empty. <Link style={{ color: "darkblue" }} to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={3}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={2}>
                    <Link to={`/products/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={3}>
                    <Form.Select
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart({
                            id: item._id,
                            quantity: Number(e.target.value),
                          })
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col lg={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>{`For (${cartItems.reduce(
                (acc, item) => acc + item.qty,
                0
              )}) ${cartItems.length > 1 ? "Items" : "Item"}`}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>SubTotal:</Col>
                <Col>
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                variant="dark"
                className="w-100"
                onClick={checkOutHandler}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
