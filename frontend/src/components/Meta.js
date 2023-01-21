import Helmet from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta title="description" content={description} />
      <meta title="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to ProShop",
  description: "We sell electronics for cheap price",
  keywords: "electronics, buy electronics, cheap electronics",
};

export default Meta;
