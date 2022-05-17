import { FC, useContext } from "react";
import NextLink from "next/link";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

import { UiContext } from "../../context";

export const AdminNavbar: FC = () => {
  const { toggleSideMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center" sx={{ color: "black" }}>
            <Typography variant="h6">Teslo |</Typography>
            <Typography variant="h6" sx={{ ml: 0.5 }}>
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
