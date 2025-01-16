import { DotGothic16, Fira_Code, Press_Start_2P } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import clsx from "clsx";
import PlausibleProvider from "next-plausible";
import { ScaffoldEthApp } from "~~/components/ScaffoldEthApp";
import { ScaffoldEthAppProviders } from "~~/components/ScaffoldEthAppProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot-gothic",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={clsx(firaCode.className, dotGothic.variable, pressStart.variable)}>
      <head>
        <PlausibleProvider domain="ctf.buidlguidl.com" />
      </head>
      <body className="bg-[url(/dot-texture.svg)]">
        <ThemeProvider enableSystem>
          <ScaffoldEthAppProviders>
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </ScaffoldEthAppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
