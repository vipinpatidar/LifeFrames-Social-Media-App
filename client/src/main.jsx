import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { DarkModeContextProvider } from "./context/darkMode.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
//REACT Query
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <DarkModeContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </DarkModeContextProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);
