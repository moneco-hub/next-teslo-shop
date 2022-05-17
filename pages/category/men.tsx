import type { NextPage } from "next";

import { Typography } from "@mui/material";

import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { ShopLayout } from "../../components/layouts";
import { useProducts } from "../../hooks";

const MenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=men");

  return (
    <ShopLayout title="Teslo-Shop - Men" pageDescription="Find the best Teslo products for Men">
      <>
        <Typography variant="h1" component="h1">
          Shop
        </Typography>
        <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
          Products for Men
        </Typography>
        {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
      </>
    </ShopLayout>
  );
};

export default MenPage;
