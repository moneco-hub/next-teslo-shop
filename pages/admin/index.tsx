import { useState, useEffect } from "react";
import { NextPage } from "next";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import useSWR from "swr";

import { AdminLayout } from "../../components/layouts";
import { SummaryTile } from "../../components/admin";
import { DashboardSummaryResponse } from "../../interfaces";

const DashboardPage: NextPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>("/api/admin/dashboard", { refreshInterval: 30000 });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al Cargar la información</Typography>;
  }

  const { numberOfOrders, paidOrders, notPaidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory } =
    data!;

  return (
    <AdminLayout title="Dashboard" subTitle="General Stats" icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={numberOfOrders}
            subTitle="Total Orders"
            icon={<CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={paidOrders}
            subTitle="Paid Orders"
            icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={notPaidOrders}
            subTitle="Pending Orders"
            icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={numberOfClients}
            subTitle="Clients"
            icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={numberOfProducts}
            subTitle="Products"
            icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={productsWithNoInventory}
            subTitle="Sold Out Products"
            icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={lowInventory}
            subTitle="On Hand"
            icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTile
            title={refreshIn}
            subTitle="Refresh in"
            icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
