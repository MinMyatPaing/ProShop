import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  fetchUserByID,
  updateUser,
} from "../store/slices/adminSlice";


const UserEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { id: userId } = params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const adminState = useSelector((state) => state.admin);
  const { userDetails, userDetailsLoading, userDetailsError } = adminState;

  useEffect(() => {
    if (!userDetails.name || userDetails._id !== userId) {
      dispatch(fetchUserByID(userId));
    } else {
      setEmail(userDetails.email);
      setName(userDetails.name);
      setIsAdmin(userDetails.isAdmin);
    }

    // return () => {
    //   dispatch(clearUserDetails());
    // };
  }, [userDetails, dispatch, userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(
      updateUser({
        _id: userDetails._id,
        name: name,
        email: email,
        isAdmin: isAdmin,
      })
    );
    navigate("/admin/userList", { replace: true });
  };

  if (userDetailsLoading) {
    return <Loader />;
  }

  return (
    <>
      <Link to="/admin/userList" className="btn btn-light">
        Go Back
      </Link>
      <FormContainer>
        <h1>Update</h1>
        <Form onSubmit={submitHandler}>
          {userDetailsError && (
            <Message variant="danger">{userDetailsError}</Message>
          )}
          {userDetailsLoading && <Loader />}
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

          <Form.Group controlId="isadmin">
            <Form.Check
              type="checkbox"
              label="Set as Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          <Button className="my-2 rounded" type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
