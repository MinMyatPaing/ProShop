import { Fragment } from "react";

import Header from "./Header";
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <main className="py-3">
        {children}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;