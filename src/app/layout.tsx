import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StyledEngineProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Automatic Inscription Script",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <StyledEngineProvider injectFirst>
        <body id="__next">
          {children}

          <Analytics />
        </body>
      </StyledEngineProvider>
    </html>
  );
}
