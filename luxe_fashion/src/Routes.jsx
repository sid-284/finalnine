import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
// Add your imports here
import Homepage from "pages/homepage";
import ProductDetail from "pages/product-detail";
import CheckoutExperience from "pages/checkout-experience";
import CollectionUniverse from "pages/collection-universe";
import NotFound from "pages/NotFound";
import Signup from "pages/Signup";
import Login from "pages/Login";
import { useUser } from "./context/UserContext";
import Wishlist from "pages/Wishlist";
import Profile from "pages/Profile";
import AdminPanel from "pages/AdminPanel";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return null; // or a spinner
  return user ? children : <Navigate to="/login" replace />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/checkout-experience" element={
          <ProtectedRoute>
            <CheckoutExperience />
          </ProtectedRoute>
        } />
        <Route path="/collection-universe" element={<CollectionUniverse />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;