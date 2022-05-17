import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";

const Custom404 = () => {
  return (
    <ShopLayout title="Page not found" pageDescription="There's not anything to show">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <Typography variant="h1" component="h1" fontWeight={80} fontSize={100}>
          404 |
        </Typography>
        <Typography marginLeft={2}>There is not any page here</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
