import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Card, ListGroup, Button, Col, Row, Image } from "react-bootstrap";

import Message from "../components/Message";
import { addOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const PlaceOrderScreen = () => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const { shippingAddress, paymentMethod } = useSelector(
    (state) => state.checkOut
  );
  const { cartItems } = useSelector((state) => state.cart);
  const { order, error } = useSelector((state) => state.order);
  const { _id } = order;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOrderPlaced && !error && _id) {
      navigate(`/order-details/${_id}`, { replace: true });
    }
  }, [isOrderPlaced, error, navigate, _id]);

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 50 : 100;

  const taxPrice = 0.015 * itemsPrice;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = () => {
    const orderItems = cartItems.map((item) => {
      const transformedItem = { ...item, product: item._id };
      delete transformedItem._id;
      return transformedItem;
    });
    try {
      setIsOrderPlaced(false);
      dispatch(
        addOrder({
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        })
      );
      dispatch(clearCart());
      setIsOrderPlaced(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city},{" "}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <strong>{paymentMethod}</strong>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            {cartItems.length > 0 ? (
              <ListGroup variant="flush">
                {cartItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/products/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={5}>
                        {item.qty} * ${item.price} = $
                        {(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Message>Your cart is empty!</Message>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>SubTotal:</Col>
                <Col>${itemsPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping Price:</Col>
                <Col>${shippingPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax:</Col>
                <Col>${taxPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total:</Col>
                <Col>${totalPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            {error && (
              <ListGroup.Item>
                <Message variant="danger">{error}</Message>
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <Button
                variant="primary"
                type="button"
                className="w-100"
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default PlaceOrderScreen;
