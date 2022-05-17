import { NextPage, GetServerSideProps } from "next";
import NextLink from "next/link";

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";

import { AdminLayout } from "../../../components/layouts";
import { CartList, OrderSummary } from "../../../components/cart";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";
import { countries } from "../../../utils";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
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

  return (
    <AdminLayout title="Order Summary" subTitle={`Order Id: ${order._id}`} icon={<ConfirmationNumberOutlined />}>
      <>
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
                  {isPaid ? (
                    <Chip sx={{ my: 2 }} label="Paid" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
                  ) : (
                    <Chip sx={{ my: 2 }} label="Pending Pay" variant="outlined" color="error" icon={<CreditCardOffOutlined />} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = "" } = query;

  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false,
      },
    };
  }

  return {
    props: { order },
  };
};

export default OrderPage;
