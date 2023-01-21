import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Card, ListGroup, Col, Row, Image, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderById,
  payOrder,
  paymentReset,
  clearOrderDetails,
} from "../store/slices/orderSlice";
import { updateOrderToDeliver } from "../store/slices/adminSlice";

const OrderDetailsScreen = () => {
  const params = useParams();
  const orderId = params.id;
  const dispatch = useDispatch();
  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();

  const {
    orderDetails,
    orderDetailsLoading,
    orderDetailsError,
    donePayment,
    paymentLoading,
    paymentError,
  } = useSelector((state) => state.order);

  const authState = useSelector((state) => state.auth);
  const { userInfo } = authState;

  const adminState = useSelector((state) => state.admin);
  const { updateDeliverLoading, updateDeliverError } = adminState;

  useEffect(() => {
    if (Object.keys(orderDetails).length === 0 || donePayment) {
      dispatch(paymentReset());
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId, donePayment, orderDetails]);

  if (orderDetailsLoading || Object.keys(orderDetails).length === 0) {
    return <Loader />;
  }

  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    user,
  } = orderDetails;

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: Number(totalPrice.toFixed(2)) },
        },
      ],
    });
  };

  const successPaymentHandler = (data, actions) => {
    return actions.order.capture().then((details) => {
      dispatch(payOrder({ id: orderId, paymentResult: details }));
    });
  };

  const deliverHandler = async () => {
    try {
      await dispatch(updateOrderToDeliver(orderId));
      dispatch(clearOrderDetails());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <h1>Order {orderId}</h1>
      {orderDetailsError && (
        <Message variant="danger">{orderDetailsError}</Message>
      )}
      {updateDeliverError && (
        <Message variant="danger">{updateDeliverError}</Message>
      )}
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Message variant="success">Delivered on {deliveredAt}</Message>
              ) : (
                <Message variant="danger">Not paid yet</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong> {paymentMethod}
              </p>
              {isPaid ? (
                <Message variant="success">Paid on {paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid yet</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant="flush">
                {orderItems.map((item, index) => (
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
              {paymentError && (
                <Message variant="danger">{paymentError}</Message>
              )}
              {!isPaid && (
                <ListGroup.Item>
                  {paymentLoading && <Loader />}
                  {isPending && <Loader />}
                  {isRejected && (
                    <Message variant="danger">SDK could not load.</Message>
                  )}
                  {isResolved && (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {userInfo.isAdmin &&
                orderDetails.isPaid &&
                !orderDetails.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark as Delivered
                    </Button>
                    {updateDeliverLoading && <Loader />}
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OrderDetailsScreen;
