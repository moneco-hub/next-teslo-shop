import { FC } from "react";

import { Typography } from "@mui/material";

import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  isLoading: boolean;
}

export const ProductsByCategory: FC<Props> = ({ products, isLoading }) => {
  return (
    <>
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </>
  );
};
