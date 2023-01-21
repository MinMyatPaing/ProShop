import { useEffect } from "react";
import { Button, Table, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { fetchProducts, deleteProductByID } from "../store/slices/productSlice";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { page: pageName } = params;

  const productState = useSelector((state) => state.product);
  const {
    products,
    page,
    pages,
    error,
    isProductsFetching,
    isProductDeleting,
  } = productState;

  const authState = useSelector((state) => state.auth);
  const { token } = authState.userInfo;

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts({ page: pageName }));
    } else {
      navigate(-1, { replace: true });
    }
  }, [token, dispatch, navigate, pageName]);

  const deleteHandler = async (id) => {
    await dispatch(deleteProductByID(id));
    dispatch(fetchProducts({ page: pageName }));
  };

  if (isProductsFetching || isProductDeleting) {
    return <Loader />;
  }

  return (
    <>
      <Row>
        <Col>
          <h1>Product List</h1>
          {error && <Message variant="danger">{error}</Message>}
        </Col>
        <Col className="text-right">
          <LinkContainer to="/admin/products/create">
            <Button className="my-3">
              <i className="fas fa-plus"></i> Create Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped bordered responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <LinkContainer to={`/admin/products/${product._id}/edit`}>
                  <Button variant="light" className="btn-sm">
                    <i className="fas fa-edit"></i>
                  </Button>
                </LinkContainer>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteHandler(product._id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate page={page} pages={pages} />
    </>
  );
};

export default ProductListScreen;
