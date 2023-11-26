import { createTheme, PaletteMode } from "@mui/material";

export default function themeRegister(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          a: {
            color: theme.palette.text.primary,
            textDecoration: "none",
          },
        }),
      },
    },
  });
}
