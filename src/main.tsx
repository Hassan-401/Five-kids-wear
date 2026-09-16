import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";
import { CatalogProvider } from "./context/CatalogContext";
import { StoreProvider } from "./context/StoreContext";
import "./index.css";

// StoreProvider prices the cart from the catalogue, so it sits inside it.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CatalogProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </CatalogProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
