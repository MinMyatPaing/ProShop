import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      color="black"
      style={{
        width: "200px",
        height: "200px",
        display: "block",
        margin: "auto",
      }}
    >
      <span className="sr-only">Loading</span>
    </Spinner>
  );
};

export default Loader;
