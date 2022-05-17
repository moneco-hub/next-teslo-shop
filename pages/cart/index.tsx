import { useContext, useEffect } from "react";
import { NextPage } from "next";
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layouts";
import { CartList, OrderSummary } from "../../components/cart";
import { CartContext } from "../../context";
import { useRouter } from "next/router";

const CartPage: NextPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace("/cart/empty");
    }
  }, [isLoaded, cart, router]);

  if (!isLoaded || cart.length === 0) {
    return <></>;
  }

  return (
    <ShopLayout title="Cart Shop" pageDescription="Cart Shop">
      <>
        <Typography variant="h1" component="h1">
          Chart
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList editable />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">Order</Typography>
                <Divider sx={{ my: 1 }} />

                <OrderSummary />

                <Box sx={{ mt: 3 }}>
                  <Button color="secondary" className="circular-btn" fullWidth href="/checkout/address">
                    Checkout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  );
};

export default CartPage;
