import { NextPage, GetServerSideProps } from "next";
import LinkNext from "next/link";
import { getSession } from "next-auth/react";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { ShopLayout } from "../../components/layouts";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Name", width: 300 },
  {
    field: "paid",
    headerName: "Paid",
    description: "Shows information about the order is paid or not",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Paid" variant="outlined" />
      ) : (
        <Chip color="error" label="Pending" variant="outlined" />
      );
    },
  },
  {
    field: "order",
    headerName: "View Order",
    width: 100,
    sortable: false,
    align: "center",
    renderCell: (params: GridValueGetterParams) => {
      return (
        <LinkNext href={`/orders/${params.row.orderId}`} passHref prefetch={false}>
          <Link underline="always">View Order</Link>
        </LinkNext>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows: any[] = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }));

  return (
    <ShopLayout title="Historial orders" pageDescription="Historical Orders">
      <>
        <Typography variant="h1" component="h1">
          Orders History
        </Typography>
        <Grid container className="fadeIn">
          <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };
  }

  const {
    user: { _id = "" },
  } = session;
  const orders = await dbOrders.getOrdersByUser(_id);

  return {
    props: { orders },
  };
};

export default HistoryPage;
