import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductsCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { fetchProducts } from "../store/slices/productSlice";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { keyword, page } = params;
  const productState = useSelector((state) => state.product);
  const {
    isProductsFetching,
    error,
    products,
    pages,
    page: pageNumber,
  } = productState;

  useEffect(() => {
    dispatch(fetchProducts({ keyword: keyword, page: page }));
  }, [dispatch, keyword, page]);

  if (isProductsFetching) {
    return <Loader />;
  }

  if (error) {
    console.log("Home Error: ", error);
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductsCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h2>Latest Products</h2>
      <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      <Paginate pages={pages} page={pageNumber} />
    </>
  );
};

export default HomeScreen;
