import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <Container>
      <Row>
        <Col className="text-center py-3">
          <footer>Copyright ProShop &copy; 2022</footer>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
