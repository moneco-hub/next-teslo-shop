import type { NextPage } from "next";

import { Typography } from "@mui/material";

import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { ShopLayout } from "../../components/layouts";
import { useProducts } from "../../hooks";

const MenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout title="Teslo-Shop - Women" pageDescription="Find the best Teslo products for Women">
      <>
        <Typography variant="h1" component="h1">
          Shop
        </Typography>
        <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
          Products for Women
        </Typography>
        {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
      </>
    </ShopLayout>
  );
};

export default MenPage;
