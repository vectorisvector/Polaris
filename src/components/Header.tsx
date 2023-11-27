import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AppBar, Box, IconButton, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

import logo from "@/assets/imgs/logo.png";
import ColorModeContext from "@/contexts/colorModeContext";

export default function Header() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const pathname = usePathname();

  const nav = [
    {
      title: "Inscription",
      link: "/",
    },
    {
      title: "Ierc Pow",
      link: "/ierc",
    },
  ];

  return (
    <AppBar
      color="inherit"
      className=" flex h-16 flex-row items-center justify-between px-10"
    >
      <h1 className=" flex items-center gap-2 text-3xl font-bold">
        <Image
          src={logo}
          alt="logo"
          width={40}
          height={40}
        />
        <Link href="/">Polaris</Link>
      </h1>

      <div className=" flex h-full items-center gap-4 text-xl font-semibold">
        {nav.map(({ title, link }) => (
          <Box
            component={Link}
            key={link}
            href={link}
            className=" flex h-full items-center"
            sx={(theme) => ({
              color:
                link === pathname
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              "&:hover": {
                color: theme.palette.primary.main,
              },
            })}
          >
            {title}
          </Box>
        ))}
      </div>

      <IconButton
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </AppBar>
  );
}
