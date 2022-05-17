import type { NextPage } from "next";
import { GetServerSideProps } from "next";

import { Box, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  //   const { products, isLoading } = useProducts("/products");

  return (
    <ShopLayout title="Teslo-Shop - Search" pageDescription="Encuentra los mejores productos de Teslo aquí">
      <>
        <Typography variant="h1" component="h1">
          Search Products
        </Typography>
        {foundProducts ? (
          <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
            Search Term: {query}
          </Typography>
        ) : (
          <Box display="flex">
            <Typography variant="h2" sx={{ mb: 1 }}>
              Not found any product for:
            </Typography>
            <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform="capitalize">
              {query}
            </Typography>
          </Box>
        )}
        <ProductList products={products} />
      </>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);

  const foundProducts: boolean = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: { products, foundProducts, query },
  };
};

export default SearchPage;
