import { useContext, useState } from "react";
import { NextPage } from "next";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { ShopLayout } from "../../../components/layouts";

import { ProductSlideshow, SizeSelector } from "../../../components/products";
import { ItemCounter } from "../../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../../interfaces";
import { dbProducts } from "../../../database";
import { ParsedUrlQuery } from "querystring";
import { CartContext } from "../../../context";

// import { initialData } from "../../../database/products";
// const product = initialData.products[0];

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const { push } = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const onSelectedSize = (size: ISize | undefined) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity,
    }));
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;

    //TODO: Call the context action to add to the cart
    addProductToCart(tempCartProduct);
    push("/");
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {`$${product.price}`}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                maxValue={product.inStock}
                updatedQuantity={onUpdateQuantity}
              />
              <SizeSelector selectedSize={tempCartProduct.size} sizes={product.sizes} onSelectedSize={onSelectedSize} />
            </Box>

            {product.inStock > 0 ? (
              <Button color={tempCartProduct.size ? "secondary" : "error"} className="circular-btn" onClick={onAddProduct}>
                {tempCartProduct.size ? "Agregar al carrito" : "Select a size"}
              </Button>
            ) : (
              <Chip label="Not Available" color="error" variant="filled" />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlugs();

  const paths: (
    | string
    | {
        params: ParsedUrlQuery;
        locale?: string | undefined;
      }
  )[] = slugs.map((s) => ({ params: { slug: s.slug } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(`${slug}`);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 86400,
  };
};

export default ProductPage;
