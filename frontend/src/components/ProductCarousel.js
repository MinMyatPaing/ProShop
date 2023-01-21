import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import Message from "./Message";
import Loader from "./Loader";
import { fetchTopRatedProducts } from "../store/slices/productSlice";

const ProductsCarousel = () => {
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  const { topProducts, topProductsLoading, topProductsError } = productState;

  useEffect(() => {
    dispatch(fetchTopRatedProducts({ limit: 3 }));
  }, [dispatch]);

  if (topProductsLoading) {
    return <Loader />;
  }

  if (topProductsError) {
    return <Message variant="danger">{topProductsError}</Message>;
  }

  return (
    <Carousel pause="hover" className="bg-dark">
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductsCarousel;
