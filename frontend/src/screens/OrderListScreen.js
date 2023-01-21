import { Button, Table } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loader";
import { fetchOrders } from "../store/slices/adminSlice";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminState = useSelector((state) => state.admin);
  const { orders, ordersLoading, ordersError } = adminState;

  const authState = useSelector((state) => state.auth);
  const { userInfo } = authState;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(fetchOrders());
    } else {
      navigate("/", { replace: true });
    }
  }, [userInfo, navigate, dispatch]);

  if (ordersLoading) {
    return <Loader />;
  }

  return (
    <>
      <h1>List of All Orders</h1>
      {ordersError && <Message variant="danger">{ordersError}</Message>}
      {orders.length > 0 ? (
        <Table striped bordered responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
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
                    <Button variant="light" className="btn btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Message>No order has been placed.</Message>
      )}
    </>
  );
};

export default OrderListScreen;
