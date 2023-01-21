import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  submitProductForm,
  fetchProductDetails,
  clearProductDetails,
} from "../store/slices/productSlice";

const ProductFormScreen = ({ isUpdate }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { id } = params;

  const productState = useSelector((state) => state.product);
  const { selectedProduct, isSingleProductFetching, error } = productState;

  useEffect(() => {
    if (isUpdate) {
      if (!selectedProduct.name || selectedProduct._id !== id) {
        dispatch(fetchProductDetails(id));
      } else {
        setName(selectedProduct.name);
        setPrice(selectedProduct.price);
        setImage(selectedProduct.image);
        setBrand(selectedProduct.brand);
        setCategory(selectedProduct.category);
        setDescription(selectedProduct.description);
        setCountInStock(selectedProduct.countInStock);
      }
    }
  }, [dispatch, id, isUpdate, selectedProduct]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      await dispatch(
        submitProductForm({
          id,
          product: {
            name: name,
            price: price,
            image: image,
            brand: brand,
            category: category,
            description: description,
            countInStock: countInStock,
          },
        })
      );
    } else {
      await dispatch(
        submitProductForm({
          id: undefined,
          product: {
            name: name,
            price: price,
            image: image,
            brand: brand,
            category: category,
            description: description,
            countInStock: countInStock,
          },
        })
      );
    }
    dispatch(clearProductDetails());
    navigate("/admin/productList", { replace: true });
  };

  const imageUploadHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setIsImageUploading(true);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response);

      setImage(response.data);
      setIsImageUploading(false);
    } catch (error) {
      console.error(error);
      setIsImageUploading(false);
    }
  };

  if (isSingleProductFetching) {
    return <Loader />;
  }

  return (
    <>
      <Link className="btn btn-light" to="/admin/productList">
        Go Back
      </Link>
      <FormContainer>
        <h1>{isUpdate ? "Edit Product" : "Create Product"}</h1>
        {error && <Message variant="danger">{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              type="file"
              onChange={imageUploadHandler}
            />
            {isImageUploading && <Loader />}
          </Form.Group>
          <Form.Group controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="category"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="countInStock">
            <Form.Label>Count in Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter count in stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="dark" className="btn-sm my-3">
            {isUpdate ? "Update Product" : "Create Product"}
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductFormScreen;
