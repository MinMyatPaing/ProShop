import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";

const Paginate = ({ pages, page }) => {
  const location = useLocation();
  const path = location.pathname;
  const baseURL =
    path.split("/page/")[0] === "/" ? "" : path.split("/page/")[0];

  if (pages <= 1) return null;
  return (
    <Pagination>
      {[...Array(pages).keys()].map((p) => (
        <LinkContainer key={p} to={`${baseURL}/page/${p + 1}`}>
          <Pagination.Item activeLabel={false} active={p + 1 === page}>
            {p + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
};

export default Paginate;
