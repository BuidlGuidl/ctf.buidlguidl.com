import { DotGothic16, Fira_Code } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import clsx from "clsx";
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={clsx(firaCode.className, dotGothic.variable)}>
      <body>
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
