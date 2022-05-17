import { FC, useMemo, useState } from "react";
import NextLink from "next/link";
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Typography } from "@mui/material";

import { IProduct } from "../../interfaces";

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[0] : product.images[1];
  }, [isHovered, product.images]);

  return (
    <Grid item xs={6} sm={4} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
        <Card>
          <CardActionArea>
            {product.inStock === 0 && (
              <Chip
                variant="filled"
                color="error"
                label="Not Available"
                sx={{ position: "absolute", zIndex: 99, top: "10px", left: "10px" }}
              />
            )}
            <CardMedia
              className="fadeIn"
              component="img"
              image={productImage}
              alt={product.title}
              onLoad={() => setIsImageLoaded(true)}
            />
          </CardActionArea>
        </Card>
      </NextLink>

      <Box sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }} className="fadeIn">
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};
