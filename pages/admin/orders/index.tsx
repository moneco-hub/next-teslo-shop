import { NextPage } from "next";
import useSWR from "swr";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Chip, Grid } from "@mui/material";

import { AdminLayout } from "../../../components/layouts";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Order Id",
    width: 100,
    renderCell: ({ row }: GridValueGetterParams) => row.createdAt.toString().slice(-4),
  },
  { field: "email", headerName: "Email", width: 300 },
  { field: "name", headerName: "User Name", width: 200 },
  { field: "total", headerName: "Total", width: 150 },
  {
    field: "isPaid",
    headerName: "Is Paid",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Paid" color="success" />
      ) : (
        <Chip variant="outlined" label="Pending" color="error" />
      );
    },
  },
  { field: "noProducts", headerName: "N° Items", width: 150, align: "center" },
  {
    field: "check",
    headerName: "View Order",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          View Order
        </a>
      );
    },
  },

  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    renderCell: ({ row }: GridValueGetterParams) => row.createdAt.toString().slice(0, 10),
  },
];

const OrdersPage: NextPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!data && !error) {
    return <></>;
  }

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout title={"Orders"} subTitle={"Order Maintenance"} icon={<ConfirmationNumberOutlined />}>
      <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
