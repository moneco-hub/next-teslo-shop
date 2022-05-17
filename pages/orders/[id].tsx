import { useState } from "react";
import { NextPage, GetServerSideProps } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios, { AxiosError } from "axios";

import { ShopLayout } from "../../components/layouts";
import { CartList, OrderSummary } from "../../components/cart";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { countries } from "../../utils";
import { tesloApi } from "../../api";

export type OrderResponseBody = {
  id: string;
  status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const {
    _id,
    isPaid,
    orderItems,
    shippingAddress: { firstName, lastName, address, address2, city, country, phone, zip },
    numberOfItems,
    subTotal,
    tax,
    total,
  } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("There is not Paypal payment");
    }

    setIsPaying(true);

    try {
      await tesloApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error: any) {
      setIsPaying(false);
      if (axios.isAxiosError(error)) {
        console.log((error as AxiosError).response?.data);
      } else {
        console.log(error.message);
      }
      alert("Error");
    }
  };

  return (
    <ShopLayout title="Order Summary" pageDescription="Order summary">
      <>
        <Typography variant="h1" component="h1">
          Order: {_id}
        </Typography>

        {isPaid ? (
          <Chip sx={{ my: 2 }} label="Paid" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
        ) : (
          <Chip sx={{ my: 2 }} label="Pending Pay" variant="outlined" color="error" icon={<CreditCardOffOutlined />} />
        )}

        <Grid container className="fadeIn">
          <Grid item xs={12} sm={7}>
            <CartList products={orderItems} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">
                  Summary ({numberOfItems} {numberOfItems > 1 ? "items" : "item"})
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">Destination Order</Typography>
                </Box>

                <Typography>
                  {firstName} {lastName}
                </Typography>
                <Typography>
                  {address}
                  {address2 && `, ${address2}`}
                </Typography>
                <Typography>{zip}</Typography>
                <Typography>{city}</Typography>
                <Typography>{countries.find((c) => c.code === country)?.name || ""}</Typography>
                <Typography>{phone}</Typography>
                <Divider />
                <Box display="flex" justifyContent="end">
                  <NextLink href="/cart" passHref>
                    <Link underline="always">Edit</Link>
                  </NextLink>
                </Box>
                <OrderSummary orderValues={{ numberOfItems, subTotal, tax, total }} />

                <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                  <Box display="flex" justifyContent="center" className="fadeIn" sx={{ display: isPaying ? "flex" : "none" }}>
                    <CircularProgress />
                  </Box>

                  <Box flexDirection="column" sx={{ display: isPaying ? "none" : "flex", flex: 1 }}>
                    {isPaid ? (
                      <Chip sx={{ my: 2 }} label="Paid" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
                    ) : (
                      <PayPalButtons
                        createOrder={(_, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: order.total.toString(),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(_, actions) => {
                          return actions.order!.capture().then((details) => {
                            // const name = details.payer.name.given_name;
                            // alert(`Transaction completed by ${name}`);
                            onOrderCompleted(details);
                          });
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: { order },
  };
};

export default OrderPage;
