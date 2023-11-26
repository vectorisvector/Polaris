import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { PaletteMode, StyledEngineProvider } from "@mui/material";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

import ThemeRegister from "@/components/ThemeRegister";

export const metadata: Metadata = {
  title: "Polaris - Automatic Alpha Script",
  description: "Automatic Alpha Script",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const themeModeData = cookieStore.get("theme-mode");

  const themeMode = (themeModeData?.value as PaletteMode | undefined) ?? "dark";

  return (
    <html lang="en">
      <StyledEngineProvider injectFirst>
        <ThemeRegister themeMode={themeMode}>{children}</ThemeRegister>
      </StyledEngineProvider>
    </html>
  );
}
