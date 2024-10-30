import { Footer } from "./Footer";
import { Header } from "./Header";

export const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative flex flex-col flex-1">{children}</main>
      <Footer />
    </div>
  );
};
