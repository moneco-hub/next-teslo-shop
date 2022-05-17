import { NextPage } from "next";
import NextLink from "next/link";
import useSWR from "swr";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";

import { AdminLayout } from "../../../components/layouts";
import { IProduct } from "../../../interfaces";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Image",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia component="img" className="fadeIn" image={row.img} alt={row.title} />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Title",
    width: 250,
    renderCell: ({ row }: GridValueGetterParams) => (
      <NextLink href={`/admin/products/${row.slug}`} passHref>
        <Link underline="always">{row.title}</Link>
      </NextLink>
    ),
  },
  { field: "gender", headerName: "Gender" },
  { field: "type", headerName: "Type" },
  { field: "inStock", headerName: "Inventory" },
  { field: "price", headerName: "Price" },
  { field: "sizes", headerName: "Sizes", width: 250 },
];

interface Props {}

//PAGE
const ProductsPage: NextPage<Props> = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!data && !error) {
    return <></>;
  }

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));

  return (
    <AdminLayout title={`Products (${data!.length})`} subTitle={"Product Maintenance"} icon={<CategoryOutlined />}>
      <>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button startIcon={<AddOutlined />} color="secondary" href="/admin/products/new">
            Create Product
          </Button>
        </Box>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </>
    </AdminLayout>
  );
};

export default ProductsPage;
