import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext({
  isDark: Boolean,
  toggleDarkMode: () => {},
});

export const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || true
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevState) => !prevState);
  };

  const context = {
    isDark: darkMode,
    toggleDarkMode: toggleDarkMode,
  };

  return (
    <DarkModeContext.Provider value={context}>
      {children}
    </DarkModeContext.Provider>
  );
};
