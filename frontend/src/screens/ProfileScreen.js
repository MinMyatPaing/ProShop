import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { fetchUserDetails, updateUserDetails } from "../store/slices/authSlice";
import { getUserOrders } from "../store/slices/orderSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const authState = useSelector((state) => state.auth);
  const orderState = useSelector((state) => state.order);
  const { profileLoading, profileError, userDetails, userInfo } = authState;
  const { userOrders, userOrdersError, userOrdersLoading } = orderState;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!userDetails) {
        dispatch(fetchUserDetails());
      } else {
        setEmail(userDetails.email);
        setName(userDetails.name);
      }
      dispatch(getUserOrders());
    }
  }, [navigate, userInfo, userDetails, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      setMessage(null);
      if (password !== confirmPassword) {
        setMessage("Passwords do not match!");
      } else {
        dispatch(
          updateUserDetails({
            _id: userInfo._id,
            name: name,
            email: email,
            password: password,
          })
        );
      }

      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      console.error(error);
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Your Profile</h2>
        <Form onSubmit={submitHandler}>
          {isSuccess && (
            <Message variant="success">
              Profile is successfully updated.
            </Message>
          )}
          {message && <Message variant="danger">{message}</Message>}
          {profileError && <Message variant="danger">{profileError}</Message>}
          {profileLoading && <Loader />}
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button className="my-2 rounded" type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>Your Orders</h2>
        {userOrdersLoading && <Loader />}
        {userOrdersError && (
          <Message variant="danger">{userOrdersError}</Message>
        )}
        {userOrders.length > 0 ? (
          <Table striped bordered responsive hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order-details/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Message>Empty! Not ordered yet!</Message>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
