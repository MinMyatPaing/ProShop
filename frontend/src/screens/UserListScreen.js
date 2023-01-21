import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { fetchAllUsers, deleteUser } from "../store/slices/adminSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminState = useSelector((state) => state.admin);
  const {
    users,
    usersLoading,
    usersError,
    deleteUserLoading,
    deleteUserError,
  } = adminState;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const deleteHandler = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(fetchAllUsers());
  };

  if (usersLoading) {
    return <Loader />;
  }

  if (usersError) {
    return <Message variant="danger">{usersError}</Message>;
  }

  return (
    <>
      <Button variant="light" onClick={() => navigate(-1)}>
        <i className="fas fa-angle-double-left"></i>
      </Button>
      <h1>List of Users</h1>
      {deleteUserError && <Message variant="danger">{deleteUserError}</Message>}
      {users.length > 0 ? (
        <Table responsive bordered striped hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    {deleteUserLoading  ? (
                      <Loader />
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Message>No users found!</Message>
      )}
    </>
  );
};

export default UserListScreen;
