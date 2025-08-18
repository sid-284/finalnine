import React from "react";
import Routes from "./Routes";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
