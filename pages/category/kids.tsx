import type { NextPage } from "next";

import { Typography } from "@mui/material";

import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { ShopLayout } from "../../components/layouts";
import { useProducts } from "../../hooks";

const KidPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout title="Teslo-Shop - Kids" pageDescription="Find the best Teslo products for Kids">
      <>
        <Typography variant="h1" component="h1">
          Shop
        </Typography>
        <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
          Products for Kids
        </Typography>
        {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
      </>
    </ShopLayout>
  );
};

export default KidPage;
