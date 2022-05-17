import { FC, useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";

import { CartContext, UiContext } from "../../context";

export const Navbar: FC = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

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

        <Box sx={{ display: isSearchVisible ? "none" : { xs: "none", sm: "block" } }} className="fadeIn">
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={asPath === "/category/men" ? "primary" : "info"} variant="contained">
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button color={asPath === "/category/women" ? "primary" : "info"} variant="contained">
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kids" passHref>
            <Link>
              <Button color={asPath === "/category/kids" ? "primary" : "info"} variant="contained">
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {/* Big screens */}
        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: "none", sm: "flex" } }}
            className="fadeIn"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value as string)}
            onKeyPress={(e) => e.key === "Enter" && onSearchTerm()}
            type="text"
            placeholder="Search..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton onClick={() => setIsSearchVisible(true)} sx={{ display: { xs: "none", sm: "flex" } }}>
            <SearchOutlined />
          </IconButton>
        )}

        {/* Small screens */}
        <IconButton className="fadeIn" sx={{ display: { xs: "flex", sm: "none" } }} onClick={toggleSideMenu}>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <Badge badgeContent={numberOfItems > 20 ? "+20" : numberOfItems} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
