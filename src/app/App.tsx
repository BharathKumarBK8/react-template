import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "../layout/Header/Header";
import LeftMenu from "../layout/LeftMenu/LeftMenu";
import { getRouteConfig } from "../api/config";
import AppRoutes, { RouteConfigModel } from "./AppRoutes";

function App() {
  const [routes, setRoutes] = useState<Array<RouteConfigModel> | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getRouteConfig().then((response: Array<RouteConfigModel>) => {
      setRoutes(response);
    });
  }, []);

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  };

  return (
    <div>
      <Header></Header>
      <div className={`body_section ${isMenuOpen ? "menu-open" : ""}`}>
        <LeftMenu onMenuToggle={handleMenuToggle}></LeftMenu>
        <div className="content_section">
          <AppRoutes routes={routes} />
        </div>
      </div>
    </div>
  );
}

export default App;
