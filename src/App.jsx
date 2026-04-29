import { useState, createContext } from "react";
import AppRoutes from "./routers/Routers";

export const ToggleContext = createContext();

export default function App() {
  const [displayHeader, setDisplayHeader] = useState(true);

  return (
    <div>
      <ToggleContext.Provider value={{ displayHeader, setDisplayHeader }}>
        <AppRoutes />
      </ToggleContext.Provider>
    </div>
  );
}
