import { useState, createContext, useEffect } from "react";
import AppRoutes from "./routers/Routers";

export const ToggleContext = createContext();

export default function App() {
  const [displayHeader, setDisplayHeader] = useState(true);

  useEffect(() => {
    fetch("/api/public/config")
      .then(r => r.json())
      .then(cfg => {
        if (cfg.googleMapsApiKey && !document.querySelector("script[src*='maps.googleapis']")) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${cfg.googleMapsApiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <ToggleContext.Provider value={{ displayHeader, setDisplayHeader }}>
        <AppRoutes />
      </ToggleContext.Provider>
    </div>
  );
}
