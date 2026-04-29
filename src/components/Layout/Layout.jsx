
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { ToggleContext } from "../../App";

export default function Layout() {
  const { displayHeader } = useContext(ToggleContext);

  return (
    <div style={{ position: "relative" }}>
      {displayHeader && <Header />}
      <Outlet />
      {displayHeader && <Footer />}
    </div>
  );
}
