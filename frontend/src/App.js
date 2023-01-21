import axios from "axios";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Layout from "./components/Layout";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductFormScreen from "./screens/ProductFormScreen";
import OrderListScreen from "./screens/OrderListScreen";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";

const App = () => {
  const [clientID, setClientID] = useState("");

  useEffect(() => {
    const getClientID = async () => {
      const { data: fetchedClientID } = await axios.get("/api/config/clientID");
      setClientID(fetchedClientID);
    };

    if (!window.paypal) {
      getClientID();
    }
  }, []);

  if (clientID === "") {
    return <Loader />;
  }

  return (
    <>
      {clientID && (
        <PayPalScriptProvider options={{ "client-id": clientID }}>
          <Layout>
            <Container>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/search/:keyword" element={<HomeScreen />} />
                <Route path="/page/:page" element={<HomeScreen />} />
                <Route path="/search/:keyword/page/:page" element={<HomeScreen />} />
                <Route path="/products/:id" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/admin/userList" element={<UserListScreen />} />
                <Route path="/admin/:id/edit" element={<UserEditScreen />} />
                <Route
                  path="/admin/productList"
                  element={<ProductListScreen />}
                />
                <Route
                  path="/admin/productList/page/:page"
                  element={<ProductListScreen />}
                />
                <Route
                  path="/admin/products/create"
                  element={<ProductFormScreen />}
                />
                <Route
                  path="/admin/products/:id/edit"
                  element={<ProductFormScreen isUpdate />}
                />
                <Route
                  path="/order-details/:id"
                  element={<OrderDetailsScreen />}
                />
                <Route path="/admin/orderList" element={<OrderListScreen />} />
              </Routes>
            </Container>
          </Layout>
        </PayPalScriptProvider>
      )}
    </>
  );
};

export default App;
