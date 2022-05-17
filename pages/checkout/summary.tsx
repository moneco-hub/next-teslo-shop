import { useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import Cookies from "js-cookie";

import { ShopLayout } from "../../components/layouts";
import { CartList, OrderSummary } from "../../components/cart";
import { CartContext } from "../../context";
import { countries } from "../../utils";

const SummaryPage: NextPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!!!Cookies.get("firstName")) {
      router.replace("/checkout/address");
    }
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder(); // TODO: Depending of the result we should navigate or not to other page
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`); //If everything went ok, message is the order id
  };

  if (!!!shippingAddress) {
    return <></>;
  }

  const { firstName, lastName, address, address2 = "", city, country, phone, zip } = shippingAddress;
  const countryName: string = countries.find((c) => c.code === country)?.name || "";

  return (
    <ShopLayout title="Summary" pageDescription="Order summary">
      <>
        <Typography variant="h1" component="h1">
          Chart
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">
                  Summary ({numberOfItems} item{numberOfItems > 1 && "s"})
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">Destination Order</Typography>
                  <NextLink href="/checkout/address" passHref>
                    <Link underline="always">Edit</Link>
                  </NextLink>
                </Box>

                <Typography>
                  {firstName} {lastName}
                </Typography>
                <Typography>
                  {address} {!!address2 && `, ${address2}`}
                </Typography>
                <Typography>
                  {city}, {zip}
                </Typography>
                <Typography>{countryName}</Typography>
                <Typography>{phone}</Typography>
                <Divider />
                <Box display="flex" justifyContent="end">
                  <NextLink href="/cart" passHref>
                    <Link underline="always">Edit</Link>
                  </NextLink>
                </Box>
                <OrderSummary />

                <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                  <Button onClick={onCreateOrder} color="secondary" className="circular-btn" fullWidth disabled={isPosting}>
                    Confirm Order
                  </Button>

                  <Chip color="error" label={errorMessage} sx={{ display: errorMessage ? "flex" : "none", mt: 2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  );
};

export default SummaryPage;
