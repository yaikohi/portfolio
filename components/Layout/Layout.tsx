import React from "react";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
