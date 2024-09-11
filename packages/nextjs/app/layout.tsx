import { Fira_Code } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthApp } from "~~/components/ScaffoldEthApp";
import { ScaffoldEthAppProviders } from "~~/components/ScaffoldEthAppProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={firaCode.className}>
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
